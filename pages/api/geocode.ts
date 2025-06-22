import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: '위도와 경도가 필요합니다.' });
  }

  const kakaoApiKey = process.env.KAKAO_REST_API_KEY;

  if (!kakaoApiKey) {
    return res.status(500).json({ message: '카카오 REST API 키가 설정되지 않았습니다.' });
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
      {
        headers: {
          'Authorization': `KakaoAK ${kakaoApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('카카오 API 호출 실패');
    }

    const data = await response.json();

    if (data.documents && data.documents.length > 0) {
      const address = data.documents[0].address;
      const roadAddress = data.documents[0].road_address;
      
      // 더 상세한 주소 정보 구성
      let finalAddress;
      let detailedAddress = '';
      
      if (roadAddress) {
        // 도로명 주소가 있는 경우
        const roadParts = roadAddress.address_name.split(' ');
        if (roadParts.length >= 3) {
          // 구/군과 도로명 추출
          const district = roadParts[1]; // 구/군
          const roadName = roadParts.slice(2).join(' '); // 도로명
          
          // 건물명이 있으면 추가
          if (roadAddress.building_name) {
            detailedAddress = `${district} ${roadName} (${roadAddress.building_name})`;
          } else {
            detailedAddress = `${district} ${roadName}`;
          }
          
          finalAddress = detailedAddress;
        } else {
          finalAddress = roadAddress.address_name;
        }
      } else {
        // 지번 주소만 있는 경우
        const addressParts = address.address_name.split(' ');
        if (addressParts.length >= 3) {
          const district = addressParts[1]; // 구/군
          const dong = addressParts[2]; // 동
          
          // 상세 주소 정보 추가
          if (addressParts.length > 3) {
            const detail = addressParts.slice(3).join(' ');
            detailedAddress = `${district} ${dong} ${detail}`;
          } else {
            detailedAddress = `${district} ${dong}`;
          }
          
          finalAddress = detailedAddress;
        } else {
          finalAddress = address.address_name;
        }
      }

      return res.status(200).json({ 
        address: finalAddress,
        fullAddress: address.address_name,
        roadAddress: roadAddress?.address_name || null,
        detailedAddress: detailedAddress
      });
    } else {
      return res.status(404).json({ message: '주소를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('주소 변환 오류:', error);
    return res.status(500).json({ message: '주소 변환 중 오류가 발생했습니다.' });
  }
} 
