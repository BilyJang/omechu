import type { NextApiRequest, NextApiResponse } from 'next';

interface Restaurant {
  name: string;
  distance: number;
  rating: number;
  address: string;
  category: string;
}

interface KakaoPlace {
  id: string;
  place_name: string;
  distance: string;
  place_url: string;
  category_name: string;
  address_name: string;
  road_address_name: string;
}

// 임시 식당 데이터 (fallback용)
const mockRestaurants: Restaurant[] = [
  {
    name: "맛있는 김치찌개",
    distance: 150,
    rating: 4.5,
    address: "서울시 강남구 테헤란로 123",
    category: "찌개/탕"
  },
  {
    name: "신선한 초밥집",
    distance: 300,
    rating: 4.8,
    address: "서울시 강남구 역삼동 456",
    category: "초밥/회"
  },
  {
    name: "정통 이탈리안 피자",
    distance: 450,
    rating: 4.3,
    address: "서울시 강남구 삼성동 789",
    category: "피자"
  },
  {
    name: "매콤달콤 탕수육",
    distance: 200,
    rating: 4.6,
    address: "서울시 강남구 논현동 321",
    category: "탕수육/깐풍기"
  },
  {
    name: "고급 스테이크하우스",
    distance: 600,
    rating: 4.9,
    address: "서울시 강남구 청담동 654",
    category: "스테이크"
  },
  {
    name: "전통 순대국밥",
    distance: 180,
    rating: 4.2,
    address: "서울시 강남구 신사동 987",
    category: "국밥/국수"
  },
  {
    name: "신선한 회사랑",
    distance: 350,
    rating: 4.7,
    address: "서울시 강남구 압구정동 147",
    category: "해산물"
  },
  {
    name: "매운 마라탕",
    distance: 280,
    rating: 4.4,
    address: "서울시 강남구 대치동 258",
    category: "마라탕/훠궈"
  },
  {
    name: "고기굽는남자",
    distance: 320,
    rating: 4.6,
    address: "서울시 강남구 신사동 369",
    category: "고기/구이"
  },
  {
    name: "배비장보쌈",
    distance: 190,
    rating: 4.3,
    address: "서울시 강남구 논현동 741",
    category: "족발/보쌈"
  },
  {
    name: "맛있는 치킨",
    distance: 250,
    rating: 4.5,
    address: "서울시 강남구 역삼동 852",
    category: "치킨"
  },
  {
    name: "신선한 라멘",
    distance: 400,
    rating: 4.4,
    address: "서울시 강남구 삼성동 963",
    category: "라멘/우동"
  },
  {
    name: "정통 돈카츠",
    distance: 380,
    rating: 4.7,
    address: "서울시 강남구 청담동 159",
    category: "돈카츠"
  },
  {
    name: "맛있는 파스타",
    distance: 420,
    rating: 4.2,
    address: "서울시 강남구 압구정동 753",
    category: "파스타"
  },
  {
    name: "신선한 버거",
    distance: 150,
    rating: 4.1,
    address: "서울시 강남구 대치동 951",
    category: "버거"
  },
  {
    name: "전통 김밥천국",
    distance: 220,
    rating: 4.0,
    address: "서울시 강남구 역삼동 111",
    category: "분식"
  },
  {
    name: "고급 와인바",
    distance: 550,
    rating: 4.8,
    address: "서울시 강남구 청담동 222",
    category: "주점/술집"
  },
  {
    name: "신선한 베이커리",
    distance: 180,
    rating: 4.3,
    address: "서울시 강남구 신사동 333",
    category: "베이커리"
  },
  {
    name: "정통 딤섬",
    distance: 310,
    rating: 4.5,
    address: "서울시 강남구 삼성동 444",
    category: "딤섬/만두"
  },
  {
    name: "맛있는 짜장면",
    distance: 270,
    rating: 4.2,
    address: "서울시 강남구 논현동 555",
    category: "짜장면/짬뽕"
  },
  {
    name: "신선한 스시",
    distance: 480,
    rating: 4.9,
    address: "서울시 강남구 압구정동 666",
    category: "스시/스키야키"
  },
  {
    name: "정통 소바",
    distance: 360,
    rating: 4.4,
    address: "서울시 강남구 대치동 777",
    category: "라멘/우동"
  },
  {
    name: "맛있는 스파게티",
    distance: 390,
    rating: 4.3,
    address: "서울시 강남구 신사동 888",
    category: "파스타"
  },
  {
    name: "신선한 햄버거",
    distance: 140,
    rating: 4.1,
    address: "서울시 강남구 역삼동 999",
    category: "버거"
  },
  {
    name: "전통 떡볶이",
    distance: 160,
    rating: 4.0,
    address: "서울시 강남구 논현동 101",
    category: "분식"
  },
  {
    name: "고급 칵테일바",
    distance: 520,
    rating: 4.7,
    address: "서울시 강남구 청담동 202",
    category: "주점/술집"
  },
  {
    name: "신선한 크림빵",
    distance: 170,
    rating: 4.4,
    address: "서울시 강남구 신사동 303",
    category: "베이커리"
  },
  {
    name: "정통 만두",
    distance: 290,
    rating: 4.3,
    address: "서울시 강남구 삼성동 404",
    category: "딤섬/만두"
  },
  {
    name: "맛있는 짬뽕",
    distance: 240,
    rating: 4.1,
    address: "서울시 강남구 압구정동 505",
    category: "짜장면/짬뽕"
  },
  {
    name: "신선한 스키야키",
    distance: 460,
    rating: 4.6,
    address: "서울시 강남구 대치동 606",
    category: "스시/스키야키"
  },
  {
    name: "정통 우동",
    distance: 340,
    rating: 4.2,
    address: "서울시 강남구 신사동 707",
    category: "라멘/우동"
  },
  {
    name: "맛있는 라자냐",
    distance: 410,
    rating: 4.4,
    address: "서울시 강남구 역삼동 808",
    category: "파스타"
  },
  {
    name: "신선한 샌드위치",
    distance: 130,
    rating: 4.0,
    address: "서울시 강남구 논현동 909",
    category: "버거"
  },
  {
    name: "전통 김밥",
    distance: 145,
    rating: 4.1,
    address: "서울시 강남구 청담동 110",
    category: "분식"
  },
  {
    name: "고급 맥주바",
    distance: 530,
    rating: 4.5,
    address: "서울시 강남구 신사동 211",
    category: "주점/술집"
  },
  {
    name: "신선한 바게트",
    distance: 165,
    rating: 4.3,
    address: "서울시 강남구 삼성동 312",
    category: "베이커리"
  },
  {
    name: "정통 샤오롱바오",
    distance: 300,
    rating: 4.4,
    address: "서울시 강남구 압구정동 413",
    category: "딤섬/만두"
  },
  {
    name: "맛있는 탕짜이",
    distance: 260,
    rating: 4.2,
    address: "서울시 강남구 대치동 514",
    category: "짜장면/짬뽕"
  },
  {
    name: "신선한 사시미",
    distance: 470,
    rating: 4.8,
    address: "서울시 강남구 신사동 615",
    category: "스시/스키야키"
  },
  {
    name: "정통 라멘",
    distance: 330,
    rating: 4.3,
    address: "서울시 강남구 역삼동 716",
    category: "라멘/우동"
  },
  {
    name: "맛있는 펜네",
    distance: 400,
    rating: 4.1,
    address: "서울시 강남구 논현동 817",
    category: "파스타"
  },
  {
    name: "신선한 치즈버거",
    distance: 135,
    rating: 4.2,
    address: "서울시 강남구 청담동 918",
    category: "버거"
  },
  {
    name: "전통 순대",
    distance: 155,
    rating: 4.0,
    address: "서울시 강남구 신사동 119",
    category: "분식"
  },
  {
    name: "고급 위스키바",
    distance: 540,
    rating: 4.6,
    address: "서울시 강남구 삼성동 220",
    category: "주점/술집"
  },
  {
    name: "신선한 단팥빵",
    distance: 175,
    rating: 4.2,
    address: "서울시 강남구 압구정동 321",
    category: "베이커리"
  },
  {
    name: "정통 샤오마이",
    distance: 285,
    rating: 4.3,
    address: "서울시 강남구 대치동 422",
    category: "딤섬/만두"
  },
  {
    name: "맛있는 마파두부",
    distance: 245,
    rating: 4.1,
    address: "서울시 강남구 신사동 523",
    category: "짜장면/짬뽕"
  },
  {
    name: "신선한 초밥",
    distance: 455,
    rating: 4.7,
    address: "서울시 강남구 역삼동 624",
    category: "스시/스키야키"
  },
  {
    name: "정통 소바",
    distance: 325,
    rating: 4.2,
    address: "서울시 강남구 논현동 725",
    category: "라멘/우동"
  },
  {
    name: "맛있는 볼로네제",
    distance: 365,
    rating: 4.3,
    address: "서울시 강남구 대치동 853",
    category: "파스타"
  },
  {
    name: "신선한 베이컨버거",
    distance: 110,
    rating: 4.2,
    address: "서울시 강남구 역삼동 954",
    category: "버거"
  },
  {
    name: "전통 김밥",
    distance: 135,
    rating: 4.0,
    address: "서울시 강남구 논현동 155",
    category: "분식"
  },
  {
    name: "고급 맥주바",
    distance: 505,
    rating: 4.5,
    address: "서울시 강남구 청담동 256",
    category: "주점/술집"
  },
  {
    name: "신선한 바게트",
    distance: 158,
    rating: 4.1,
    address: "서울시 강남구 신사동 357",
    category: "베이커리"
  },
  {
    name: "정통 하가오",
    distance: 270,
    rating: 4.3,
    address: "서울시 강남구 삼성동 458",
    category: "딤섬/만두"
  },
  {
    name: "맛있는 짜장면",
    distance: 265,
    rating: 4.2,
    address: "서울시 강남구 압구정동 559",
    category: "짜장면/짬뽕"
  },
  {
    name: "신선한 회",
    distance: 440,
    rating: 4.4,
    address: "서울시 강남구 대치동 660",
    category: "스시/스키야키"
  },
  {
    name: "정통 우동",
    distance: 305,
    rating: 4.0,
    address: "서울시 강남구 역삼동 761",
    category: "라멘/우동"
  },
  {
    name: "맛있는 까르보나라",
    distance: 355,
    rating: 4.2,
    address: "서울시 강남구 논현동 862",
    category: "파스타"
  },
  {
    name: "신선한 더블버거",
    distance: 105,
    rating: 4.1,
    address: "서울시 강남구 청담동 963",
    category: "버거"
  },
  {
    name: "전통 순대",
    distance: 130,
    rating: 4.3,
    address: "서울시 강남구 신사동 164",
    category: "분식"
  },
  {
    name: "고급 와인바",
    distance: 495,
    rating: 4.6,
    address: "서울시 강남구 삼성동 265",
    category: "주점/술집"
  },
  {
    name: "신선한 단팥빵",
    distance: 152,
    rating: 4.0,
    address: "서울시 강남구 압구정동 366",
    category: "베이커리"
  },
  {
    name: "정통 샤오롱바오",
    distance: 268,
    rating: 4.4,
    address: "서울시 강남구 대치동 467",
    category: "딤섬/만두"
  },
  {
    name: "맛있는 짬뽕",
    distance: 275,
    rating: 4.1,
    address: "서울시 강남구 역삼동 568",
    category: "짜장면/짬뽕"
  },
  {
    name: "신선한 사시미",
    distance: 435,
    rating: 4.5,
    address: "서울시 강남구 논현동 669",
    category: "스시/스키야키"
  },
  {
    name: "정통 라멘",
    distance: 300,
    rating: 4.2,
    address: "서울시 강남구 청담동 770",
    category: "라멘/우동"
  },
  {
    name: "맛있는 알리오올리오",
    distance: 345,
    rating: 4.3,
    address: "서울시 강남구 신사동 871",
    category: "파스타"
  },
  {
    name: "신선한 치킨버거",
    distance: 100,
    rating: 4.0,
    address: "서울시 강남구 삼성동 972",
    category: "버거"
  }
];

// 카카오 로컬 API로 실제 식당 검색
async function searchNearbyRestaurants(lat: string, lng: string): Promise<Restaurant[]> {
  const kakaoApiKey = process.env.KAKAO_REST_API_KEY;
  
  console.log('=== 카카오 로컬 API 설정 확인 ===');
  console.log('카카오 REST API 키 존재 여부:', !!kakaoApiKey);
  console.log('카카오 REST API 키 길이:', kakaoApiKey ? kakaoApiKey.length : 0);
  console.log('카카오 REST API 키 시작 부분:', kakaoApiKey ? kakaoApiKey.substring(0, 10) + '...' : '없음');
  
  if (!kakaoApiKey) {
    console.log('카카오 REST API 키가 설정되지 않음, 모의 데이터 사용');
    return mockRestaurants;
  }

  try {
    console.log('카카오 로컬 API 호출 시작...');
    
    // 여러 페이지를 가져와서 더 다양한 거리의 식당들을 포함
    const allRestaurants: Restaurant[] = [];
    const maxPages = 3; // 최대 3페이지까지 가져오기 (15 * 3 = 45개)
    
    for (let page = 1; page <= maxPages; page++) {
      const url = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=FD6&x=${lng}&y=${lat}&radius=3000&size=15&page=${page}`;
      console.log(`요청 URL (페이지 ${page}):`, url);
      
      // 카카오 로컬 API 호출 (REST API 키 사용)
      const response = await fetch(
        url,
        {
          headers: {
            'Authorization': `KakaoAK ${kakaoApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`카카오 API 응답 상태 (페이지 ${page}):`, response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`카카오 API 오류 응답 (페이지 ${page}):`, errorText);
        break; // 오류 발생 시 중단
      }

      const data = await response.json();
      console.log(`카카오 API 응답 데이터 구조 (페이지 ${page}):`, {
        documents: data.documents ? data.documents.length : 0,
        meta: data.meta
      });
      
      if (!data.documents || data.documents.length === 0) {
        console.log(`페이지 ${page}에서 식당을 찾을 수 없음, 중단`);
        break;
      }

      console.log(`카카오 API에서 찾은 식당 수 (페이지 ${page}):`, data.documents.length);

      // 카카오 API 응답을 우리 형식으로 변환
      const pageRestaurants: Restaurant[] = data.documents.map((place: KakaoPlace) => ({
        name: place.place_name,
        distance: parseInt(place.distance),
        rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)), // 실제 평점이 없으므로 랜덤 생성, 소수점 한 자리로 반올림
        address: place.road_address_name || place.address_name,
        category: getCategoryFromKakao(place.category_name)
      }));

      allRestaurants.push(...pageRestaurants);
      
      // 마지막 페이지인지 확인
      if (data.meta && data.meta.is_end) {
        console.log(`페이지 ${page}가 마지막 페이지입니다.`);
        break;
      }
      
      // API 호출 간격을 두기 위해 잠시 대기
      if (page < maxPages) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log('총 수집된 식당 수:', allRestaurants.length);
    console.log('거리별 분포:', allRestaurants.map(r => r.distance).sort((a, b) => a - b));

    // 중복 제거 (같은 이름의 식당이 여러 페이지에 있을 수 있음)
    const uniqueRestaurants = allRestaurants.filter((restaurant, index, self) => 
      index === self.findIndex(r => r.name === restaurant.name)
    );

    console.log('중복 제거 후 식당 수:', uniqueRestaurants.length);
    console.log('변환된 식당 데이터 (처음 5개):', uniqueRestaurants.slice(0, 5));

    return uniqueRestaurants.sort((a, b) => a.distance - b.distance);

  } catch (error) {
    console.error('카카오 API 호출 오류:', error);
    console.log('모의 데이터로 대체');
    return mockRestaurants;
  }
}

// 카카오 카테고리를 우리 카테고리로 변환
function getCategoryFromKakao(kakaoCategory: string): string {
  const category = kakaoCategory.toLowerCase();
  
  // 한식 세분화
  if (category.includes('한식')) {
    if (category.includes('육류') || category.includes('고기') || category.includes('삼겹살') || category.includes('갈비')) return '고기/구이';
    if (category.includes('족발') || category.includes('보쌈')) return '족발/보쌈';
    if (category.includes('해물') || category.includes('생선') || category.includes('회')) return '해산물';
    if (category.includes('국밥') || category.includes('국수') || category.includes('면')) return '국밥/국수';
    if (category.includes('찌개') || category.includes('탕') || category.includes('전골')) return '찌개/탕';
    if (category.includes('치킨') || category.includes('닭')) return '치킨';
    if (category.includes('분식') || category.includes('떡볶이')) return '분식';
    return '한식';
  }
  
  // 중식 세분화
  if (category.includes('중식')) {
    if (category.includes('마라') || category.includes('훠궈')) return '마라탕/훠궈';
    if (category.includes('탕수육') || category.includes('깐풍기')) return '탕수육/깐풍기';
    if (category.includes('짜장') || category.includes('짬뽕')) return '짜장면/짬뽕';
    if (category.includes('딤섬') || category.includes('만두')) return '딤섬/만두';
    return '중식';
  }
  
  // 일식 세분화
  if (category.includes('일식')) {
    if (category.includes('초밥') || category.includes('회') || category.includes('사시미')) return '초밥/회';
    if (category.includes('라멘') || category.includes('우동') || category.includes('소바')) return '라멘/우동';
    if (category.includes('돈카츠') || category.includes('가츠')) return '돈카츠';
    if (category.includes('스시') || category.includes('스키야키')) return '스시/스키야키';
    return '일식';
  }
  
  // 양식 세분화
  if (category.includes('양식')) {
    if (category.includes('피자')) return '피자';
    if (category.includes('파스타') || category.includes('스파게티')) return '파스타';
    if (category.includes('스테이크') || category.includes('고기')) return '스테이크';
    if (category.includes('버거') || category.includes('햄버거')) return '버거';
    return '양식';
  }
  
  // 기타 카테고리
  if (category.includes('카페') || category.includes('커피') || category.includes('디저트')) return '카페/디저트';
  if (category.includes('패스트푸드') || category.includes('치킨')) return '패스트푸드';
  if (category.includes('분식') || category.includes('떡볶이') || category.includes('김밥')) return '분식';
  if (category.includes('베이커리') || category.includes('빵') || category.includes('제과')) return '베이커리';
  if (category.includes('주점') || category.includes('술집') || category.includes('바')) return '주점/술집';
  if (category.includes('치킨') || category.includes('닭')) return '치킨';
  if (category.includes('피자')) return '피자';
  if (category.includes('족발') || category.includes('보쌈')) return '족발/보쌈';
  if (category.includes('해산물') || category.includes('회')) return '해산물';
  if (category.includes('국밥') || category.includes('국수')) return '국밥/국수';
  if (category.includes('찌개') || category.includes('탕')) return '찌개/탕';
  if (category.includes('마라탕') || category.includes('훠궈')) return '마라탕/훠궈';
  if (category.includes('탕수육') || category.includes('깐풍기')) return '탕수육/깐풍기';
  if (category.includes('짜장면') || category.includes('짬뽕')) return '짜장면/짬뽕';
  if (category.includes('초밥') || category.includes('회')) return '초밥/회';
  if (category.includes('라멘') || category.includes('우동')) return '라멘/우동';
  if (category.includes('돈카츠')) return '돈카츠';
  if (category.includes('파스타') || category.includes('스파게티')) return '파스타';
  if (category.includes('스테이크')) return '스테이크';
  if (category.includes('버거') || category.includes('햄버거')) return '버거';
  if (category.includes('베이커리') || category.includes('빵')) return '베이커리';
  if (category.includes('주점') || category.includes('술집')) return '주점/술집';
  
  return '기타';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { lat, lng, page = '1', limit = '10' } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: '위도와 경도가 필요해요!' });
  }

  try {
    // 실제 카카오 API로 주변 식당 검색
    const restaurants = await searchNearbyRestaurants(lat as string, lng as string);
    
    // 최대 100개까지 반환
    const maxRestaurants = restaurants.slice(0, 100);
    
    // 페이지네이션 처리
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedRestaurants = maxRestaurants.slice(startIndex, endIndex);
    
    const totalPages = Math.ceil(maxRestaurants.length / limitNum);
    
    res.status(200).json({
      restaurants: paginatedRestaurants,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalItems: maxRestaurants.length,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('식당 데이터 조회 오류:', error);
    res.status(500).json({ message: '식당 정보를 불러오는데 실패했어요' });
  }
} 
