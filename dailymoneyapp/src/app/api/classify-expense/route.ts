import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize Google Generative AI client
// API key is automatically loaded from GEMINI_API_KEY environment variable
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

interface TransactionClassification {
  type: 'income' | 'expense';
  amount: number;
  jar?: string; // Only for expenses
  category: string;
  confidence: number;
  description: string;
  source?: string; // Only for income
}

export async function POST(request: NextRequest) {
  try {
    // Check API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: text is required' },
        { status: 400 }
      );
    }

    // Create prompt for Gemini - Explicitly request JSON only
    const prompt = `Phân tích câu nói và phân loại là THU NHẬP hay CHI TIÊU. Trả về ĐÚNG định dạng JSON (CHỈ JSON, KHÔNG text khác).

Câu: "${text}"

PHÂN LOẠI:
1. THU NHẬP (income): Từ khóa như "nhận", "lương", "thu nhập", "được trả", "bonus", "thưởng", "kiếm được"
2. CHI TIÊU (expense): Từ khóa như "mua", "chi", "tiêu", "trả tiền", "ăn", "đi", "đổ xăng"

6 HŨ CHI TIÊU (chỉ dùng cho expense):
- NEC: Ăn uống, thuê nhà, điện nước, đi lại, quần áo
- FFA: Đầu tư, thu nhập thụ động
- LTS: Tiết kiệm, quỹ khẩn cấp
- EDU: Sách, khóa học
- PLAY: Giải trí, du lịch, sở thích
- GIVE: Từ thiện, quà tặng

FORMAT JSON:

Nếu THU NHẬP:
{"type": "income", "amount": 10000000, "source": "Lương tháng 2", "category": "Lương", "confidence": 0.95, "description": "Nhận lương"}

Nếu CHI TIÊU:
{"type": "expense", "amount": 50000, "jar": "NEC", "category": "Ăn uống", "confidence": 0.95, "description": "Ăn trưa"}

VÍ DỤ:
- "Tôi vừa nhận lương 10 triệu" → {"type": "income", "amount": 10000000, "source": "Lương", "category": "Lương", "confidence": 0.95, "description": "Nhận lương"}
- "Vừa ăn trưa 50 nghìn" → {"type": "expense", "amount": 50000, "jar": "NEC", "category": "Ăn uống", "confidence": 0.95, "description": "Ăn trưa"}
- "Nhận thưởng 5 triệu" → {"type": "income", "amount": 5000000, "source": "Thưởng", "category": "Thưởng", "confidence": 0.9, "description": "Nhận thưởng"}

QUY TẮC:
- amount: số nguyên (50 nghìn = 50000, 10 triệu = 10000000)
- type: "income" hoặc "expense"
- jar: CHỈ có khi type="expense"
- source: CHỈ có khi type="income"
- confidence: 0.0-1.0

CHỈ trả về JSON, KHÔNG thêm text nào khác.`;

    // Call Gemini API using SDK
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Extract the generated text
    const generatedText = response.text;

    if (!generatedText) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    // Clean up the response text
    let cleanedText = generatedText.trim();
    
    // Remove markdown code blocks
    cleanedText = cleanedText.replace(/```json\n?/g, '');
    cleanedText = cleanedText.replace(/```\n?/g, '');
    cleanedText = cleanedText.trim();
    
    // Try to extract JSON from text if there's extra content
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    // Replace single quotes with double quotes (common AI mistake)
    cleanedText = cleanedText.replace(/'/g, '"');
    
    // Log the cleaned text for debugging
    console.log('AI Response (cleaned):', cleanedText);

    try {
      const classification: TransactionClassification = JSON.parse(cleanedText);

      // Validate classification
      if (
        typeof classification.amount !== 'number' ||
        classification.amount <= 0
      ) {
        throw new Error('Invalid amount');
      }

      if (!classification.type || (classification.type !== 'income' && classification.type !== 'expense')) {
        throw new Error('Invalid type (must be income or expense)');
      }

      // Validate jar for expenses
      if (classification.type === 'expense') {
        const validJars = ['NEC', 'FFA', 'LTS', 'EDU', 'PLAY', 'GIVE'];
        if (!classification.jar || !validJars.includes(classification.jar)) {
          throw new Error('Invalid or missing jar code for expense');
        }
      }

      // Ensure source exists for income
      if (classification.type === 'income' && !classification.source) {
        classification.source = classification.category || 'Thu nhập';
      }

      console.log('Classification:', classification);

      return NextResponse.json(classification);
    } catch (parseError: any) {
      console.error('Failed to parse AI response:', cleanedText);
      console.error('Parse error:', parseError.message);
      
      return NextResponse.json(
        {
          error: 'Failed to parse AI response',
          details: cleanedText,
          parseError: parseError.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in classify-expense API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
