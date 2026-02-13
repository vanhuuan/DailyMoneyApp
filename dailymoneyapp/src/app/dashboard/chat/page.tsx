'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useState, useRef, useEffect } from 'react';
import { createTransaction, addIncome } from '@/lib/firebase';
import { JAR_DEFINITIONS, getJarByCode, calculateJarAllocation } from '@/lib/constants/jars';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
  classification?: {
    type: 'income' | 'expense';
    amount: number;
    jar?: string; // Only for expenses
    category: string;
    confidence: number;
    description: string;
    source?: string; // Only for income
  };
}

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      text: 'Xin chào! Tôi có thể giúp bạn ghi chi tiêu và thu nhập nhanh chóng.\n\nVí dụ:\n• "Vừa ăn trưa 50 nghìn" → Chi tiêu\n• "Tôi vừa nhận lương 10 triệu" → Thu nhập (tự động phân bổ 6 hũ)',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle voice transcript
  useEffect(() => {
    if (transcript && !isListening) {
      setInputText(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, resetTranscript]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isProcessing) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      // Call AI classification API
      const response = await fetch('/api/classify-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to classify expense');
      }

      const classification = await response.json();

      // Add assistant response with classification
      let assistantText = '';
      
      if (classification.type === 'income') {
        // Income message
        assistantText = `🎉 Tuyệt vời! Bạn vừa nhận **${formatCurrency(classification.amount)}** từ **${classification.source || classification.category}**.

📊 **Phân bổ 6 Hũ**:
${JAR_DEFINITIONS.map(jar => {
  const allocation = calculateJarAllocation(classification.amount, jar.percentage);
  return `${jar.icon} ${jar.name}: ${formatCurrency(allocation)} (${jar.percentage}%)`;
}).join('\n')}

Bạn có muốn lưu khoản thu nhập này và tự động phân bổ vào 6 hũ không?`;
      } else {
        // Expense message
        const jarInfo = getJarByCode(classification.jar!);
        assistantText = `Tôi hiểu rồi! Bạn vừa chi **${formatCurrency(classification.amount)}** cho **${classification.description}**.

Tôi phân loại vào:
🏷️ **Hũ**: ${jarInfo?.name} (${classification.jar})
📂 **Danh mục**: ${classification.category}
🎯 **Độ tin cậy**: ${(classification.confidence * 100).toFixed(0)}%

Bạn có muốn lưu chi tiêu này không?`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: assistantText,
        timestamp: new Date(),
        classification,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Classification error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        text: 'Xin lỗi, tôi không thể hiểu được. Bạn có thể thử lại không?',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async (message: Message) => {
    if (!message.classification || !user || isSaving) return;

    setIsSaving(true);

    try {
      const { type, amount, category, description } = message.classification;

      if (type === 'income') {
        // Save income and auto-allocate to jars
        await addIncome(user.uid, {
          amount,
          source: message.classification.source || category,
          category,
          description: description || 'Thu nhập',
          autoAllocate: true, // This will trigger allocation to jars
        });

        // Success message for income
        const successMessage: Message = {
          id: Date.now().toString(),
          type: 'system',
          text: '✅ Đã lưu thu nhập và phân bổ vào 6 hũ thành công! 🎉',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, successMessage]);
      } else {
        // Save expense
        const { jar } = message.classification;
        
        await createTransaction(user.uid, {
          amount,
          jarCode: jar!,
          category,
          description,
          recognizedText: message.text,
          type: 'expense',
        });

        // Success message for expense
        const successMessage: Message = {
          id: Date.now().toString(),
          type: 'system',
          text: '✅ Đã lưu chi tiêu thành công! Bạn có thể tiếp tục ghi chi tiêu khác.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, successMessage]);
      }
    } catch (error: any) {
      console.error('Save error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        text: '❌ Có lỗi khi lưu giao dịch. Vui lòng thử lại.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const cancelMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      text: '❌ Đã hủy. Bạn có thể tiếp tục ghi giao dịch khác.',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, cancelMessage]);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      // Clear any previous errors before starting
      resetTranscript();
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Voice Chat</h1>
          <p className="mt-2 text-gray-600">
            Ghi chi tiêu nhanh bằng giọng nói hoặc text
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-red-900">
            ❌ Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Vui lòng
            sử dụng Chrome, Edge, hoặc Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="border-b bg-white p-4">
        <h1 className="text-2xl font-bold">AI Voice Chat</h1>
        <p className="text-sm text-gray-600">
          Nói hoặc gõ chi tiêu / thu nhập của bạn
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : message.type === 'system'
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-white shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.text}</p>

                {/* Confirmation buttons */}
                {message.classification && message.type === 'assistant' && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleConfirm(message)}
                      disabled={isSaving}
                      className="flex-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {isSaving ? 'Đang lưu...' : '✅ Xác nhận'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      ❌ Hủy
                    </button>
                  </div>
                )}

                <p className="mt-2 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-blue-600"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white p-3 sm:p-4">
        <div className="mx-auto w-full max-w-3xl">
          {/* Voice transcript preview */}
          {(isListening || interimTranscript) && (
            <div className="mb-2 rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-900">
                {isListening ? '🎙️ Đang nghe...' : 'Đã dừng ghi âm'}
              </p>
              {interimTranscript && (
                <p className="mt-1 text-sm italic text-blue-700">
                  {interimTranscript}
                </p>
              )}
            </div>
          )}

          {/* Speech error */}
          {speechError && (
            <div className="mb-2 flex items-start gap-2 rounded-lg bg-red-50 p-3">
              <p className="flex-1 text-sm text-red-900">
                ❌ {speechError}
              </p>
              <button
                onClick={resetTranscript}
                className="text-red-900 hover:text-red-700"
                title="Đóng"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex w-full items-center gap-2">
            {/* Voice button */}
            <button
              onClick={handleVoiceToggle}
              disabled={isProcessing}
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-xl transition-colors ${
                isListening
                  ? 'animate-pulse bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50`}
            >
              {isListening ? '🔴' : '🎙️'}
            </button>

            {/* Text input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="VD: Vừa ăn trưa 50k / Nhận lương 10 triệu..."
              disabled={isProcessing || isListening}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 sm:px-4 sm:py-2.5"
            />

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isProcessing || isListening}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-xl font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? '⏳' : '📤'}
            </button>
          </div>

          <p className="mt-2 text-center text-xs text-gray-500">
            Nhấn 🎙️ để nói hoặc gõ chi tiêu / thu nhập của bạn
          </p>
        </div>
      </div>
    </div>
  );
}
