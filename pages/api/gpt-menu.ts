import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { MenuRecommendationRequest, MenuRecommendationResponse, ApiErrorResponse } from '@/types/api';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 모의 GPT 응답 함수
const getMockRecommendation = (mood: string): string => {
  const recommendations = {
    '기뻐': '오늘 기분이 좋으시다니 다행이에요! 🎉 기분 좋은 날에는 색다른 음식을 먹어보는 건 어떨까요? 추천 메뉴: 화려한 색감의 파스타, 신선한 샐러드, 달콤한 디저트가 어울릴 것 같아요!',
    '우울해': '우울한 기분이시군요 😔 이런 날에는 마음을 위로해주는 따뜻한 음식이 좋을 것 같아요. 추천 메뉴: 따뜻한 국수, 스팀푸드, 따뜻한 차와 함께하는 간단한 디저트가 어떨까요?',
    '피곤해': '피곤하시군요 😴 에너지를 채워줄 음식이 필요하겠네요! 추천 메뉴: 단백질이 풍부한 고기 요리, 비타민이 가득한 과일, 에너지 충전에 좋은 견과류가 어울릴 것 같아요!',
    '배고파': '배고프시군요! 😋 맛있고 든든한 음식이 필요하겠네요. 추천 메뉴: 든든한 한식 (김치찌개, 된장찌개), 양식 (파스타, 피자), 또는 간단하지만 맛있는 샌드위치가 어떨까요?',
    '스트레스': '스트레스 받으시는군요 😤 스트레스 해소에 좋은 음식을 먹어보세요! 추천 메뉴: 마음을 진정시켜주는 따뜻한 차, 달콤한 초콜릿, 신선한 과일, 또는 간단한 요리로 요리하는 것도 스트레스 해소에 도움이 될 거예요!'
  };

  // 기분에 따른 추천 반환
  for (const [key, value] of Object.entries(recommendations)) {
    if (mood.includes(key)) {
      return value;
    }
  }

  // 기본 추천
  return `오늘 ${mood} 기분이시군요! 🍽️ 이런 기분에는 맛있는 음식이 최고죠. 추천 메뉴: 기분에 맞는 음식을 선택해서 먹어보세요. 간단한 요리부터 시작해보는 것도 좋을 것 같아요!`;
};

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<MenuRecommendationResponse | ApiErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { mood }: MenuRecommendationRequest = req.body;

  if (!mood) {
    return res.status(400).json({ message: '기분 정보가 필요해요!' });
  }

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return res.status(500).json({ message: 'OpenAI API 키가 설정되지 않았어요! .env.local 파일에 실제 API 키를 입력해주세요.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '너는 메뉴 추천을 도와주는 귀여운 요리사야. 한국어로 친근하게 답변해줘.' },
        { role: 'user', content: `지금 나는 ${mood} 기분이야. 어떤 메뉴가 좋을까?` },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const recommendation = completion.choices[0].message?.content || '추천 실패 😢';
    res.status(200).json({ recommendation });
  } catch (error) {
    console.error('GPT API 오류:', error);
    
    // 더 구체적인 오류 메시지 제공
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        res.status(500).json({ message: 'OpenAI API 키가 유효하지 않아요! 올바른 API 키를 확인해주세요.' });
      } else if (error.message.includes('429') || error.message.includes('insufficient_quota')) {
        // API 한도 초과 시 모의 응답 제공
        const mockRecommendation = getMockRecommendation(mood);
        res.status(200).json({ 
          recommendation: mockRecommendation + '\n\n💡 참고: 현재 OpenAI API 사용량 한도가 초과되어 모의 응답을 제공하고 있습니다. API 한도 문제가 해결되면 실제 GPT 추천을 받을 수 있어요!' 
        });
      } else if (error.message.includes('500')) {
        res.status(500).json({ message: 'OpenAI 서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.' });
      } else {
        res.status(500).json({ message: 'GPT 추천 실패', error: error.message });
      }
    } else {
      res.status(500).json({ message: '알 수 없는 오류가 발생했어요.' });
    }
  }
} 
