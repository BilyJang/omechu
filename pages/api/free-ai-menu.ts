import type { NextApiRequest, NextApiResponse } from 'next';
import { MenuRecommendationRequest, MenuRecommendationResponse, ApiErrorResponse } from '@/types/api';

// 음식 카테고리 매핑
const getFoodCategories = (mood: string): string[] => {
  const categories = {
    '기뻐': ['양식', '카페/디저트', '일식', '중식', '피자', '파스타', '초밥/회'],
    '우울해': ['한식', '국밥/국수', '찌개/탕', '카페/디저트', '베이커리', '따뜻한 음식'],
    '피곤해': ['고기/구이', '한식', '양식', '해산물', '스테이크', '에너지 음식'],
    '배고파': ['한식', '양식', '중식', '고기/구이', '피자', '버거', '든든한 음식'],
    '스트레스': ['카페/디저트', '한식', '양식', '주점/술집', '베이커리', '힐링 음식']
  };

  for (const [key, value] of Object.entries(categories)) {
    if (mood.includes(key)) {
      return value;
    }
  }

  return ['한식', '양식', '중식', '일식', '카페/디저트'];
};

// 주변 식당 검색 함수
async function searchNearbyRestaurants(lat: string, lng: string, categories: string[]): Promise<any[]> {
  const kakaoApiKey = process.env.KAKAO_REST_API_KEY;
  
  if (!kakaoApiKey) {
    console.log('카카오 REST API 키가 설정되지 않음');
    return [];
  }

  try {
    console.log('=== 주변 식당 검색 시작 ===');
    console.log('검색 카테고리:', categories);
    
    // 여러 페이지를 가져와서 더 다양한 거리의 식당들을 포함
    const allRestaurants: any[] = [];
    const maxPages = 3; // 최대 3페이지까지 가져오기 (15 * 3 = 45개)
    
    for (let page = 1; page <= maxPages; page++) {
      const url = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=FD6&x=${lng}&y=${lat}&radius=3000&size=15&page=${page}`;
      console.log(`요청 URL (페이지 ${page}):`, url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `KakaoAK ${kakaoApiKey}`
        }
      });
      
      if (!response.ok) {
        console.error(`카카오 API 오류 (페이지 ${page}):`, response.status, response.statusText);
        break;
      }
      
      const data = await response.json();
      console.log(`카카오 API 응답 데이터 구조 (페이지 ${page}):`, {
        documents: data.documents?.length || 0,
        meta: data.meta
      });
      
      if (data.documents && data.documents.length > 0) {
        console.log(`카카오 API에서 찾은 식당 수 (페이지 ${page}):`, data.documents.length);
        
        // 카테고리 필터링 및 변환
        const filteredRestaurants = data.documents
          .map((place: any) => {
            const category = getCategoryFromKakao(place.category_name);
            console.log(`식당: ${place.place_name}, 원본 카테고리: ${place.category_name}, 변환된 카테고리: ${category}`);
            return {
              name: place.place_name,
              distance: parseInt(place.distance),
              address: place.road_address_name || place.address_name,
              category: category,
              originalCategory: place.category_name
            };
          })
          .filter((restaurant: any) => {
            // 카테고리 매칭 로직 개선
            const isMatch = categories.some(cat => {
              // 정확한 매칭
              if (restaurant.category === cat) return true;
              
              // 포함 관계 매칭 (더 정확하게)
              if (restaurant.category.includes(cat) || cat.includes(restaurant.category)) return true;
              
              // 특별한 매칭 규칙
              if (cat === '고기/구이' && (restaurant.category === '족발/보쌈' || restaurant.category === '고기/구이')) return true;
              if (cat === '해산물' && (restaurant.category === '초밥/회' || restaurant.category === '해산물')) return true;
              if (cat === '한식' && (restaurant.category === '국밥/국수' || restaurant.category === '찌개/탕' || restaurant.category === '한식')) return true;
              if (cat === '양식' && (restaurant.category === '피자' || restaurant.category === '파스타' || restaurant.category === '스테이크' || restaurant.category === '버거' || restaurant.category === '양식')) return true;
              if (cat === '일식' && (restaurant.category === '초밥/회' || restaurant.category === '라멘/우동' || restaurant.category === '돈카츠' || restaurant.category === '일식')) return true;
              if (cat === '중식' && (restaurant.category === '짜장면/짬뽕' || restaurant.category === '탕수육/깐풍기' || restaurant.category === '딤섬/만두' || restaurant.category === '마라탕/훠궈' || restaurant.category === '중식')) return true;
              if (cat === '카페/디저트' && (restaurant.category === '베이커리' || restaurant.category === '카페/디저트')) return true;
              
              return false;
            });
            
            console.log(`식당 ${restaurant.name} (${restaurant.category}) - 매칭 결과: ${isMatch}`);
            return isMatch;
          });
        
        allRestaurants.push(...filteredRestaurants);
      }
      
      // 마지막 페이지인지 확인
      if (data.meta?.is_end) {
        console.log(`페이지 ${page}가 마지막 페이지입니다.`);
        break;
      }
      
      if (page < maxPages) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log('총 수집된 식당 수:', allRestaurants.length);
    
    // 중복 제거 및 거리순 정렬
    const uniqueRestaurants = allRestaurants.filter((restaurant, index, self) => 
      index === self.findIndex(r => r.name === restaurant.name)
    );

    console.log('중복 제거 후 식당 수:', uniqueRestaurants.length);
    console.log('최종 추천 식당들:', uniqueRestaurants.slice(0, 5).map(r => `${r.name} (${r.category})`));

    return uniqueRestaurants.sort((a, b) => a.distance - b.distance).slice(0, 5);

  } catch (error) {
    console.error('주변 식당 검색 오류:', error);
    return [];
  }
}

// 카카오 카테고리를 우리 카테고리로 변환
function getCategoryFromKakao(kakaoCategory: string): string {
  const category = kakaoCategory.toLowerCase();
  
  // 구체적인 카테고리부터 매칭 (우선순위 높음)
  if (category.includes('족발') || category.includes('보쌈')) return '족발/보쌈';
  if (category.includes('해물') || category.includes('생선') || category.includes('회') || category.includes('사시미')) return '해산물';
  if (category.includes('국밥') || category.includes('국수') || category.includes('면') || category.includes('칼국수')) return '국밥/국수';
  if (category.includes('찌개') || category.includes('탕') || category.includes('전골')) return '찌개/탕';
  if (category.includes('치킨') || category.includes('닭') || category.includes('통닭')) return '치킨';
  if (category.includes('분식') || category.includes('떡볶이') || category.includes('김밥')) return '분식';
  if (category.includes('마라') || category.includes('훠궈')) return '마라탕/훠궈';
  if (category.includes('탕수육') || category.includes('깐풍기')) return '탕수육/깐풍기';
  if (category.includes('짜장') || category.includes('짬뽕')) return '짜장면/짬뽕';
  if (category.includes('딤섬') || category.includes('만두')) return '딤섬/만두';
  if (category.includes('초밥') || category.includes('스시')) return '초밥/회';
  if (category.includes('라멘') || category.includes('우동') || category.includes('소바')) return '라멘/우동';
  if (category.includes('돈카츠') || category.includes('가츠')) return '돈카츠';
  if (category.includes('스키야키')) return '스시/스키야키';
  if (category.includes('피자')) return '피자';
  if (category.includes('파스타') || category.includes('스파게티')) return '파스타';
  if (category.includes('스테이크')) return '스테이크';
  if (category.includes('버거') || category.includes('햄버거')) return '버거';
  if (category.includes('베이커리') || category.includes('빵') || category.includes('제과')) return '베이커리';
  if (category.includes('주점') || category.includes('술집') || category.includes('바')) return '주점/술집';
  
  // 대분류 카테고리 매칭 (우선순위 낮음)
  if (category.includes('한식')) {
    if (category.includes('육류') || category.includes('고기') || category.includes('삼겹살') || category.includes('갈비')) return '고기/구이';
    return '한식';
  }
  
  if (category.includes('중식')) return '중식';
  if (category.includes('일식')) return '일식';
  if (category.includes('양식')) return '양식';
  if (category.includes('카페') || category.includes('커피') || category.includes('디저트')) return '카페/디저트';
  if (category.includes('패스트푸드')) return '패스트푸드';
  
  return '기타';
}

// 모의 GPT 응답 함수 (무료 AI 추천)
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

// 고급 모의 AI 응답 (더 다양하고 개성있는 추천)
const getAdvancedMockRecommendation = (mood: string): string => {
  const moodResponses = {
    '기뻐': [
      '🎉 기분이 좋으시다니 정말 다행이에요! 이런 날에는 색다른 경험을 해보는 게 어떨까요? 추천: 화려한 색감의 태국 음식, 신선한 샐러드, 달콤한 디저트가 어울릴 것 같아요!',
      '😊 기쁜 마음에는 기쁜 음식이 어울려요! 추천: 화려한 파스타, 신선한 과일 샐러드, 달콤한 아이스크림이 어떨까요?',
      '🌟 기분 좋은 날에는 특별한 음식으로 더욱 특별하게! 추천: 색다른 퓨전 요리, 신선한 회, 달콤한 케이크가 어울릴 것 같아요!'
    ],
    '우울해': [
      '😔 우울한 기분이시군요. 이런 날에는 마음을 위로해주는 따뜻한 음식이 좋을 것 같아요. 추천: 따뜻한 국수, 스팀푸드, 따뜻한 차와 함께하는 간단한 디저트가 어떨까요?',
      '💙 우울할 때는 마음을 따뜻하게 해주는 음식이 최고예요. 추천: 따뜻한 수프, 부드러운 푸딩, 따뜻한 우유가 어울릴 것 같아요.',
      '🤗 우울한 마음을 위로해주는 음식으로 기분 전환해보세요! 추천: 따뜻한 차, 달콤한 초콜릿, 부드러운 아이스크림이 어떨까요?'
    ],
    '피곤해': [
      '😴 피곤하시군요! 에너지를 채워줄 음식이 필요하겠네요! 추천: 단백질이 풍부한 고기 요리, 비타민이 가득한 과일, 에너지 충전에 좋은 견과류가 어울릴 것 같아요!',
      '💪 피곤할 때는 에너지 충전이 중요해요! 추천: 고단백 식사, 신선한 과일, 에너지 바가 어떨까요?',
      '⚡ 피곤함을 날려버릴 강력한 음식으로 에너지를 충전해보세요! 추천: 고기 요리, 견과류, 비타민이 풍부한 음식이 어울릴 것 같아요!'
    ],
    '배고파': [
      '😋 배고프시군요! 맛있고 든든한 음식이 필요하겠네요. 추천: 든든한 한식 (김치찌개, 된장찌개), 양식 (파스타, 피자), 또는 간단하지만 맛있는 샌드위치가 어떨까요?',
      '🍽️ 배고플 때는 든든한 한 끼가 최고예요! 추천: 김치찌개, 된장찌개, 파스타, 피자 중에서 선택해보세요!',
      '🤤 배고픔을 해결할 맛있는 음식으로 배를 채워보세요! 추천: 한식, 양식, 중식 중에서 마음에 드는 걸로!'
    ],
    '스트레스': [
      '😤 스트레스 받으시는군요! 스트레스 해소에 좋은 음식을 먹어보세요! 추천: 마음을 진정시켜주는 따뜻한 차, 달콤한 초콜릿, 신선한 과일, 또는 간단한 요리로 요리하는 것도 스트레스 해소에 도움이 될 거예요!',
      '🧘‍♀️ 스트레스 해소에는 마음을 진정시켜주는 음식이 좋아요! 추천: 따뜻한 차, 달콤한 디저트, 신선한 과일이 어떨까요?',
      '💆‍♂️ 스트레스 받을 때는 마음을 위로해주는 음식으로 힐링해보세요! 추천: 따뜻한 음료, 달콤한 간식, 신선한 과일이 어울릴 것 같아요!'
    ]
  };

  // 기분에 따른 랜덤 추천 반환
  for (const [key, responses] of Object.entries(moodResponses)) {
    if (mood.includes(key)) {
      const randomIndex = Math.floor(Math.random() * responses.length);
      return responses[randomIndex];
    }
  }

  // 기본 추천 (랜덤)
  const defaultResponses = [
    `오늘 ${mood} 기분이시군요! 🍽️ 이런 기분에는 맛있는 음식이 최고죠. 추천 메뉴: 기분에 맞는 음식을 선택해서 먹어보세요.`,
    `${mood} 기분이시라니! 😊 이런 날에는 특별한 음식으로 기분 전환해보는 건 어떨까요? 추천: 마음에 드는 음식을 골라서 즐겨보세요!`,
    `오늘 ${mood} 하시는군요! 🌟 이런 기분에는 맛있는 음식이 위로가 될 거예요. 추천: 기분에 맞는 음식을 선택해서 맛있게 드세요!`
  ];
  
  const randomIndex = Math.floor(Math.random() * defaultResponses.length);
  return defaultResponses[randomIndex];
};

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<MenuRecommendationResponse | ApiErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { mood, lat, lng }: MenuRecommendationRequest & { lat?: string; lng?: string } = req.body;

  if (!mood) {
    return res.status(400).json({ message: '기분 정보가 필요해요!' });
  }

  try {
    // 고급 모의 AI 응답 제공 (무료)
    const advancedRecommendation = getAdvancedMockRecommendation(mood);
    console.log('고급 모의 AI 응답 사용');
    
    let finalRecommendation = advancedRecommendation + '\n\n🤖 무료 AI 추천 시스템으로 생성된 맞춤형 메뉴 추천입니다!';
    
    // 위치 정보가 있으면 주변 식당 추천 추가
    if (lat && lng) {
      const categories = getFoodCategories(mood);
      const nearbyRestaurants = await searchNearbyRestaurants(lat, lng, categories);
      
      if (nearbyRestaurants.length > 0) {
        finalRecommendation += '\n\n📍 주변 추천 식당:\n';
        nearbyRestaurants.forEach((restaurant, index) => {
          finalRecommendation += `${index + 1}. ${restaurant.name} (${restaurant.distance}m) - ${restaurant.category} - ${restaurant.address}\n`;
        });
        finalRecommendation += '\n💡 위 식당들을 확인해보세요!';
      }
    }
    
    res.status(200).json({ 
      recommendation: finalRecommendation
    });

  } catch (error) {
    console.error('AI 추천 오류:', error);
    res.status(500).json({ message: 'AI 추천을 생성하는 중 오류가 발생했어요.' });
  }
} 
