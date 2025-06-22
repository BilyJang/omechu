import React, { useEffect, useState, useMemo } from 'react';
import PWAInstallPrompt from './PWAInstallPrompt';

interface Location {
  lat: number | null;
  lng: number | null;
  address?: string;
  accuracy?: number;
}

interface Restaurant {
  name: string;
  distance: number;
  rating: number;
  address?: string;
  category?: string;
}

interface DeliveryStatus {
  baemin: boolean;
  yogiyo: boolean;
  coupang: boolean;
}

export default function HomeScreen() {
  const [location, setLocation] = useState<Location>({ lat: null, lng: null });
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [randomPick, setRandomPick] = useState<Restaurant | null>(null);
  const [mood, setMood] = useState("");
  const [gptResult, setGptResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGptLoading, setIsGptLoading] = useState(false);
  const [deliveryStatuses, setDeliveryStatuses] = useState<{ [key: string]: DeliveryStatus }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  // 카테고리별 필터링된 식당 목록
  const filteredRestaurants = useMemo(() => {
    if (selectedCategory === '전체') {
      return restaurants;
    }
    return restaurants.filter(restaurant => restaurant.category === selectedCategory);
  }, [restaurants, selectedCategory]);

  // 필터링된 결과에 대한 페이지네이션 계산
  const filteredPagination = useMemo(() => {
    const itemsPerPage = 45; // 10개에서 45개로 증가
    const totalItems = filteredRestaurants.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredRestaurants.slice(startIndex, endIndex);
    
    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      currentItems
    };
  }, [filteredRestaurants, currentPage]);

  // 사용 가능한 카테고리 목록
  const availableCategories = useMemo(() => {
    const categories = ['전체', ...Array.from(new Set(restaurants.map(r => r.category).filter(Boolean)))];
    return categories;
  }, [restaurants]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log('GPS 정확도:', accuracy, 'm');
          setLocation({ lat: latitude, lng: longitude, accuracy });
          
          // 주소 정보 가져오기
          try {
            const addressResponse = await fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`);
            if (addressResponse.ok) {
              const addressData = await addressResponse.json();
              setLocation(prev => ({ ...prev, address: addressData.address }));
            }
          } catch (error) {
            console.error('주소 변환 오류:', error);
          }
          
          fetchNearbyRestaurants(latitude, longitude);
        },
        (err) => {
          console.error('위치 오류:', err);
          if (err.code === 1) {
            setError("위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.");
          } else if (err.code === 2) {
            setError("위치를 찾을 수 없습니다. 인터넷 연결을 확인해주세요.");
          } else if (err.code === 3) {
            setError("위치 요청 시간이 초과되었습니다. 다시 시도해주세요.");
          } else {
            setError("위치를 가져오는데 실패했습니다. 브라우저 설정을 확인해주세요.");
          }
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 30000 
        }
      );
    } else {
      setError("GPS 기능을 사용할 수 없어요. 브라우저를 업데이트하거나 다른 브라우저를 사용해주세요.");
    }
  }, []);

  const fetchNearbyRestaurants = async (lat: number, lng: number, page: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/restaurants?lat=${lat}&lng=${lng}&page=${page}&limit=45`);
      if (!res.ok) {
        throw new Error('식당 데이터를 불러오는데 실패했어요');
      }
      const data = await res.json();
      setRestaurants(data.restaurants);
      setPagination(data.pagination);
      // 클라이언트 사이드 페이지네이션을 위해 항상 1페이지로 시작
      setCurrentPage(1);
    } catch (err) {
      setError("식당 데이터를 불러오는 중 오류 발생");
      console.error('식당 데이터 로딩 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const retryLocation = () => {
    setError(null);
    setLocation({ lat: null, lng: null });
    setRestaurants([]);
    setRandomPick(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log('GPS 정확도:', accuracy, 'm');
          setLocation({ lat: latitude, lng: longitude, accuracy });
          
          // 주소 정보 가져오기
          try {
            const addressResponse = await fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`);
            if (addressResponse.ok) {
              const addressData = await addressResponse.json();
              setLocation(prev => ({ ...prev, address: addressData.address }));
            }
          } catch (error) {
            console.error('주소 변환 오류:', error);
          }
          
          fetchNearbyRestaurants(latitude, longitude);
        },
        (err) => {
          setError("위치를 가져오는데 실패했습니다. 브라우저 설정을 확인해주세요.");
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 30000 
        }
      );
    }
  };

  const getRandomPick = () => {
    if (restaurants.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * restaurants.length);
    const picked = restaurants[randomIndex];
    setRandomPick(picked);
    
    // 랜덤 추천된 식당의 배달앱 상태 확인
    if (picked.address) {
      checkDeliveryStatus(picked.name, picked.address).then(status => {
        setDeliveryStatuses(prev => ({
          ...prev,
          [`${picked.name}-${picked.address}`]: status
        }));
      });
    }
  };

  const askGptForMenu = async () => {
    if (!mood.trim()) {
      setError("기분을 입력해주세요!");
      return;
    }

    setIsGptLoading(true);
    setError(null);
    
    try {
      // 무료 AI API 사용 (위치 정보 포함)
      const requestBody: any = { mood: mood.trim() };
      
      // 위치 정보가 있으면 함께 전송
      if (location.lat && location.lng) {
        requestBody.lat = location.lat.toString();
        requestBody.lng = location.lng.toString();
      }
      
      const res = await fetch("/api/free-ai-menu", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'AI 추천을 받는데 실패했어요');
      }
      
      setGptResult(data.recommendation);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "AI 추천을 받는 중 오류가 발생했어요";
      setError(errorMessage);
      console.error('AI API 오류:', err);
    } finally {
      setIsGptLoading(false);
    }
  };

  // 배달앱 연동 상태 확인
  const checkDeliveryStatus = async (restaurantName: string, address: string) => {
    try {
      const response = await fetch('/api/delivery-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantName, address }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.deliveryStatus;
      }
    } catch (error) {
      console.error('배달앱 연동 확인 오류:', error);
    }
    
    return { baemin: false, yogiyo: false, coupang: false };
  };

  // 배달앱 링크 생성
  const getDeliveryLink = (app: string, restaurantName: string, address: string) => {
    const searchQuery = encodeURIComponent(`${restaurantName} ${address}`);
    
    switch (app) {
      case 'baemin':
        // 배달의민족 - 메인 페이지로 이동 (사용자가 직접 검색)
        return 'https://www.baemin.com';
      case 'yogiyo':
        // 요기요 - 메인 페이지로 이동 (사용자가 직접 검색)
        return 'https://www.yogiyo.co.kr';
      case 'coupang':
        // 쿠팡이츠 - 메인 페이지로 이동 (사용자가 직접 검색)
        return 'https://www.coupangeats.com';
      default:
        return '#';
    }
  };

  // 모든 식당의 배달 상태를 한 번에 확인
  useEffect(() => {
    const checkAllDeliveryStatuses = async () => {
      const newStatuses: { [key: string]: DeliveryStatus } = {};
      
      for (const restaurant of restaurants) {
        if (restaurant.address) {
          const deliveryKey = `${restaurant.name}-${restaurant.address}`;
          if (!deliveryStatuses[deliveryKey]) {
            try {
              const status = await checkDeliveryStatus(restaurant.name, restaurant.address);
              newStatuses[deliveryKey] = status;
            } catch (error) {
              console.error(`배달 상태 확인 실패 (${restaurant.name}):`, error);
              newStatuses[deliveryKey] = { baemin: false, yogiyo: false, coupang: false };
            }
          }
        }
      }
      
      if (Object.keys(newStatuses).length > 0) {
        setDeliveryStatuses(prev => ({ ...prev, ...newStatuses }));
      }
    };

    if (restaurants.length > 0) {
      checkAllDeliveryStatuses();
    }
  }, [restaurants]);

  // 페이지 변경 함수
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* 배경 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-yellow-100/20 to-pink-100/30"></div>
      
      {/* 메인 컨텐츠 */}
      <div className="relative z-10 container mx-auto px-4 py-4 sm:py-8 max-w-md sm:max-w-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            오늘 메뉴 추천 (오메추)
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-medium">
            맛있는 메뉴를 추천해드릴게요! 🍽️
          </p>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-xl mb-4 shadow-sm">
            <p className="mb-2 text-sm sm:text-base">{error}</p>
            <div className="flex gap-2">
              <button 
                onClick={retryLocation}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition-all duration-200 shadow-sm"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {location.lat && location.lng ? (
          <div className="space-y-4 sm:space-y-6">
            {/* 위치 정보 */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">📍 내 위치</h2>
              </div>
              {location.address ? (
                <div>
                  <p className="text-sm sm:text-base text-gray-700 font-medium">
                    {location.address}
                  </p>
                  {location.accuracy && (
                    <p className="text-xs text-gray-500 mt-1">
                      📡 GPS 정확도: ±{location.accuracy.toFixed(0)}m
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-sm sm:text-base text-gray-700 font-medium">
                    위도: {location.lat.toFixed(6)}, 경도: {location.lng.toFixed(6)}
                  </p>
                  {location.accuracy && (
                    <p className="text-xs text-gray-500 mt-1">
                      📡 GPS 정확도: ±{location.accuracy.toFixed(0)}m
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 랜덤 추천 */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">🎯 랜덤 추천</h2>
              <button 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={getRandomPick}
                disabled={isLoading || restaurants.length === 0}
              >
                {isLoading ? '로딩 중...' : '3초 안에 골라줘!'}
              </button>

              {randomPick && (
                <div className="mt-4 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-blue-800">🎯 오늘의 추천!</h3>
                  <a 
                    href={`https://search.naver.com/search.naver?query=${encodeURIComponent(randomPick.name + ' ' + (randomPick.address || ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer block"
                  >
                    {randomPick.name}
                  </a>
                  <p className="text-xs sm:text-sm text-gray-600">📍 {randomPick.distance}m 거리</p>
                  <p className="text-xs sm:text-sm text-gray-600">⭐ 평점: {randomPick.rating}</p>
                  {randomPick.address && (
                    <p className="text-xs sm:text-sm text-gray-600">🏠 {randomPick.address}</p>
                  )}
                  <p className="text-xs sm:text-sm text-gray-600">🍽️ {randomPick.category}</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
                    <a
                      href={`https://map.naver.com/p/search/${encodeURIComponent(randomPick.address || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 sm:px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm"
                    >
                      🗺️ 네이버지도
                    </a>
                    <a
                      href={`https://map.kakao.com/link/search/${encodeURIComponent(randomPick.address || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 sm:px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-sm"
                    >
                      🚗 카카오맵
                    </a>
                  </div>
                  {/* 랜덤 추천 배달앱 버튼들 */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                    <div className="relative group">
                      <a
                        href={deliveryStatuses[`${randomPick.name}-${randomPick.address}`]?.baemin ? getDeliveryLink('baemin', randomPick.name, randomPick.address || '') : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-2 sm:px-3 py-1 text-xs rounded-lg transition-all duration-200 shadow-sm ${
                          deliveryStatuses[`${randomPick.name}-${randomPick.address}`]?.baemin 
                            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={e => !deliveryStatuses[`${randomPick.name}-${randomPick.address}`]?.baemin && e.preventDefault()}
                      >
                        🛵 배달의민족
                      </a>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        {randomPick.name} - {randomPick.address || ''}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                    <div className="relative group">
                      <a
                        href={deliveryStatuses[`${randomPick.name}-${randomPick.address}`]?.yogiyo ? getDeliveryLink('yogiyo', randomPick.name, randomPick.address || '') : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-2 sm:px-3 py-1 text-xs rounded-lg transition-all duration-200 shadow-sm ${
                          deliveryStatuses[`${randomPick.name}-${randomPick.address}`]?.yogiyo 
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={e => !deliveryStatuses[`${randomPick.name}-${randomPick.address}`]?.yogiyo && e.preventDefault()}
                      >
                        🍕 요기요
                      </a>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        {randomPick.name} - {randomPick.address || ''}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                    <div className="relative group">
                      <a
                        href={deliveryStatuses[`${randomPick.name}-${randomPick.address}`]?.coupang ? getDeliveryLink('coupang', randomPick.name, randomPick.address || '') : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-2 sm:px-3 py-1 text-xs rounded-lg transition-all duration-200 shadow-sm ${
                          deliveryStatuses[`${randomPick.name}-${randomPick.address}`]?.coupang 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={e => !deliveryStatuses[`${randomPick.name}-${randomPick.address}`]?.coupang && e.preventDefault()}
                      >
                        📦 쿠팡이츠
                      </a>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                        {randomPick.name} - {randomPick.address || ''}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 추천 리스트 */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">📋 주변 추천 리스트</h2>
              
              {/* 카테고리 필터 버튼들 */}
              {restaurants.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">카테고리별 필터:</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {availableCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category || '전체');
                          setCurrentPage(1);
                        }}
                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-all duration-200 shadow-sm ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                            : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedCategory === '전체' 
                      ? `전체 ${restaurants.length}개 식당` 
                      : `${selectedCategory} ${filteredRestaurants.length}개 식당`
                    }
                  </p>
                </div>
              )}
              
              {isLoading ? (
                <p className="text-gray-500 text-sm sm:text-base">식당 정보를 불러오는 중...</p>
              ) : filteredRestaurants.length > 0 ? (
                <div className="space-y-3">
                  {filteredPagination.currentItems.map((restaurant, i) => {
                    const deliveryKey = `${restaurant.name}-${restaurant.address}`;
                    const deliveryStatus = deliveryStatuses[deliveryKey] || { baemin: false, yogiyo: false, coupang: false };
                    
                    return (
                      <div key={i} className="border-b border-gray-200 pb-3 last:border-b-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div className="flex-1 mb-3 sm:mb-0">
                            <a 
                              href={`https://search.naver.com/search.naver?query=${encodeURIComponent(restaurant.name + ' ' + (restaurant.address || ''))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-base sm:text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer block"
                            >
                              {restaurant.name}
                            </a>
                            <p className="text-xs sm:text-sm text-gray-600">📍 {restaurant.distance}m 거리</p>
                            <p className="text-xs sm:text-sm text-gray-600">⭐ 평점: {restaurant.rating}</p>
                            {restaurant.address && (
                              <p className="text-xs sm:text-sm text-gray-600">🏠 {restaurant.address}</p>
                            )}
                            <p className="text-xs sm:text-sm text-gray-600">🍽️ {restaurant.category}</p>
                          </div>
                          <div className="flex flex-wrap gap-1 sm:flex-col sm:space-y-2 sm:ml-4">
                            <a
                              href={`https://map.naver.com/p/search/${encodeURIComponent(restaurant.address || '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 sm:px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm"
                            >
                              🗺️ 네이버지도
                            </a>
                            <a
                              href={`https://map.kakao.com/link/search/${encodeURIComponent(restaurant.address || '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 sm:px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-sm"
                            >
                              🚗 카카오맵
                            </a>
                            {/* 배달앱 버튼들 */}
                            <div className="relative group">
                              <a
                                href={deliveryStatus.baemin ? getDeliveryLink('baemin', restaurant.name, restaurant.address || '') : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-2 sm:px-3 py-1 text-xs rounded-lg transition-all duration-200 shadow-sm ${
                                  deliveryStatus.baemin 
                                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                onClick={e => !deliveryStatus.baemin && e.preventDefault()}
                              >
                                🛵 배달의민족
                              </a>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                {restaurant.name} - {restaurant.address || ''}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                              </div>
                            </div>
                            <div className="relative group">
                              <a
                                href={deliveryStatus.yogiyo ? getDeliveryLink('yogiyo', restaurant.name, restaurant.address || '') : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-2 sm:px-3 py-1 text-xs rounded-lg transition-all duration-200 shadow-sm ${
                                  deliveryStatus.yogiyo 
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                onClick={e => !deliveryStatus.yogiyo && e.preventDefault()}
                              >
                                🍕 요기요
                              </a>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                {restaurant.name} - {restaurant.address || ''}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                              </div>
                            </div>
                            <div className="relative group">
                              <a
                                href={deliveryStatus.coupang ? getDeliveryLink('coupang', restaurant.name, restaurant.address || '') : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`px-2 sm:px-3 py-1 text-xs rounded-lg transition-all duration-200 shadow-sm ${
                                  deliveryStatus.coupang 
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                onClick={e => !deliveryStatus.coupang && e.preventDefault()}
                              >
                                📦 쿠팡이츠
                              </a>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                {restaurant.name} - {restaurant.address || ''}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">주변에 추천할 식당이 없습니다.</p>
              )}
              
              {/* 페이지네이션 */}
              {filteredPagination.totalPages > 1 && (
                <div className="mt-4 sm:mt-6 flex justify-center items-center space-x-1 sm:space-x-2">
                  {/* 이전 페이지 버튼 */}
                  <button
                    onClick={() => handlePageChange(filteredPagination.currentPage - 1)}
                    disabled={!filteredPagination.hasPrevPage}
                    className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm ${
                      filteredPagination.hasPrevPage
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    이전
                  </button>
                  
                  {/* 페이지 번호들 */}
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, filteredPagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (filteredPagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (filteredPagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (filteredPagination.currentPage >= filteredPagination.totalPages - 2) {
                        pageNum = filteredPagination.totalPages - 4 + i;
                      } else {
                        pageNum = filteredPagination.currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm ${
                            filteredPagination.currentPage === pageNum
                              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:from-gray-300 hover:to-gray-400'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* 다음 페이지 버튼 */}
                  <button
                    onClick={() => handlePageChange(filteredPagination.currentPage + 1)}
                    disabled={!filteredPagination.hasNextPage}
                    className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm ${
                      filteredPagination.hasNextPage
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    다음
                  </button>
                </div>
              )}
              
              {/* 페이지 정보 */}
              {filteredPagination.totalItems > 0 && (
                <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-600">
                  총 {filteredPagination.totalItems}개 식당 중 {(filteredPagination.currentPage - 1) * filteredPagination.itemsPerPage + 1}~{Math.min(filteredPagination.currentPage * filteredPagination.itemsPerPage, filteredPagination.totalItems)}번째 표시
                </div>
              )}
            </div>

            {/* AI 추천 */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">🤖 AI에게 물어보기 (무료)</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base transition-all duration-200 shadow-sm"
                  placeholder="기분을 입력해보세요 (예: 우울해, 기뻐, 피곤해)"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && askGptForMenu()}
                />
                <button
                  className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={askGptForMenu}
                  disabled={isGptLoading || !mood.trim()}
                >
                  {isGptLoading ? '생각 중...' : 'AI에게 메뉴 물어보기 (무료)'}
                </button>
              </div>
              
              {gptResult && (
                <div className="mt-4 p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
                  <h3 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">🤖 AI 추천 메뉴</h3>
                  <div className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                    {gptResult.split('\n').map((line, index) => {
                      // 주변 추천 식당 섹션인지 확인
                      if (line.includes('📍 주변 추천 식당:')) {
                        return <div key={index} className="font-semibold text-green-800 mt-3">{line}</div>;
                      }
                      
                      // 식당 추천 라인인지 확인 (숫자. 식당명 (거리m) - 카테고리 - 주소 형식)
                      const restaurantMatch = line.match(/^(\d+)\.\s+(.+?)\s+\((\d+)m\)\s+-\s+(.+?)\s+-\s+(.+)$/);
                      if (restaurantMatch) {
                        const [, number, restaurantName, distance, category, address] = restaurantMatch;
                        const searchQuery = `${restaurantName} ${address}`;
                        
                        return (
                          <div key={index} className="flex items-center space-x-2 mt-1">
                            <span className="text-green-600 font-medium">{number}.</span>
                            <a
                              href={`https://search.naver.com/search.naver?query=${encodeURIComponent(searchQuery)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                            >
                              {restaurantName}
                            </a>
                            <span className="text-gray-500">({distance}m) - {category}</span>
                          </div>
                        );
                      }
                      
                      // 기존 형식도 지원 (숫자. 식당명 (거리m) - 카테고리 형식)
                      const oldRestaurantMatch = line.match(/^(\d+)\.\s+(.+?)\s+\((\d+)m\)\s+-\s+(.+)$/);
                      if (oldRestaurantMatch) {
                        const [, number, restaurantName, distance, category] = oldRestaurantMatch;
                        // 주변 식당 목록에서 해당 식당의 주소 찾기
                        const restaurant = restaurants.find(r => r.name === restaurantName);
                        const searchQuery = restaurant?.address 
                          ? `${restaurantName} ${restaurant.address}`
                          : restaurantName;
                        
                        return (
                          <div key={index} className="flex items-center space-x-2 mt-1">
                            <span className="text-green-600 font-medium">{number}.</span>
                            <a
                              href={`https://search.naver.com/search.naver?query=${encodeURIComponent(searchQuery)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                            >
                              {restaurantName}
                            </a>
                            <span className="text-gray-500">({distance}m) - {category}</span>
                          </div>
                        );
                      }
                      
                      // 일반 텍스트
                      return <div key={index}>{line}</div>;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 광고 배너 */}
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl shadow-lg p-4 sm:p-6 text-center border border-purple-200">
              <a
                href={process.env.NEXT_PUBLIC_AD_BANNER_LINK || "https://www.google.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="text-white">
                  <p className="text-base sm:text-lg font-semibold mb-2 group-hover:scale-105 transition-transform duration-200">
                    {process.env.NEXT_PUBLIC_AD_BANNER_TEXT || '특별한 맛집을 찾고 계신가요? 🍽️'}
                  </p>
                  <p className="text-sm sm:text-base opacity-90 group-hover:opacity-100 transition-opacity duration-200">
                    클릭하여 더 많은 맛집 정보를 확인해보세요! ✨
                  </p>
                  <div className="mt-3 inline-flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium group-hover:bg-opacity-30 transition-all duration-200 shadow-sm">
                    <span>자세히 보기</span>
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            </div>
          </div>
        ) : !error ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600">위치를 찾는 중...</p>
          </div>
        ) : null}
      </div>
      
      <PWAInstallPrompt />
    </div>
  );
} 
