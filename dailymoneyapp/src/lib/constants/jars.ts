export interface JarDefinition {
  code: string;
  name: string;
  nameEn: string;
  icon: string;
  percentage: number;
  color: string;
  description: string;
  examples: string[];
}

export const JAR_DEFINITIONS: JarDefinition[] = [
  {
    code: 'NEC',
    name: 'Thiết yếu',
    nameEn: 'Necessities',
    icon: '🏠',
    percentage: 55,
    color: 'jar-nec',
    description: 'Chi phí sinh hoạt thiết yếu hàng ngày',
    examples: [
      'Tiền nhà',
      'Ăn uống',
      'Đi lại',
      'Điện nước',
      'Điện thoại',
      'Internet',
    ],
  },
  {
    code: 'FFA',
    name: 'Tự do tài chính',
    nameEn: 'Financial Freedom',
    icon: '💰',
    percentage: 10,
    color: 'jar-ffa',
    description: 'Đầu tư để tạo thu nhập thụ động',
    examples: [
      'Cổ phiếu',
      'Quỹ đầu tư',
      'Bất động sản',
      'Crypto',
      'Kinh doanh',
    ],
  },
  {
    code: 'LTSS',
    name: 'Tiết kiệm dài hạn',
    nameEn: 'Long-term Savings',
    icon: '🏦',
    percentage: 10,
    color: 'jar-ltss',
    description: 'Tiết kiệm cho các mục tiêu lớn',
    examples: [
      'Mua nhà',
      'Mua xe',
      'Du học',
      'Quỹ khẩn cấp',
      'Hưu trí',
    ],
  },
  {
    code: 'EDU',
    name: 'Giáo dục',
    nameEn: 'Education',
    icon: '📚',
    percentage: 10,
    color: 'jar-edu',
    description: 'Đầu tư vào bản thân',
    examples: [
      'Sách',
      'Khóa học online',
      'Hội thảo',
      'Chứng chỉ',
      'Coaching',
    ],
  },
  {
    code: 'PLAY',
    name: 'Giải trí',
    nameEn: 'Play',
    icon: '🎮',
    percentage: 10,
    color: 'jar-play',
    description: 'Thưởng cho bản thân',
    examples: [
      'Du lịch',
      'Shopping',
      'Ăn nhà hàng',
      'Xem phim',
      'Spa',
      'Sở thích',
    ],
  },
  {
    code: 'GIVE',
    name: 'Từ thiện',
    nameEn: 'Give',
    icon: '❤️',
    percentage: 5,
    color: 'jar-give',
    description: 'Giúp đỡ người khác',
    examples: [
      'Quyên góp',
      'Quà tặng',
      'Từ thiện',
      'Hỗ trợ gia đình',
      'Tình nguyện',
    ],
  },
];

export const getJarByCode = (code: string): JarDefinition | undefined => {
  return JAR_DEFINITIONS.find((jar) => jar.code === code);
};

export const getJarColor = (code: string): string => {
  const jar = getJarByCode(code);
  return jar ? jar.color : 'gray';
};

export const getJarName = (code: string): string => {
  const jar = getJarByCode(code);
  return jar ? jar.name : code;
};

/**
 * Calculate allocation amount for a jar based on percentage
 */
export const calculateJarAllocation = (
  amount: number,
  percentage: number
): number => {
  return Math.round((amount * percentage) / 100);
};
