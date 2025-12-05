// script.js

document.addEventListener('DOMContentLoaded', () => {
    const orderButton = document.getElementById('order-button');
    const informationButton = document.getElementById('information-button');
    const errorBanner = document.getElementById('error-banner');
    const errorMessage = document.getElementById('error-message');
    const remainingNumberElement = document.getElementById('remaining-number');
    const distractionImages = document.querySelectorAll('.distraction-image');
    const singleSubImages = document.querySelectorAll('.single-sub-image');
    
    // 새로 추가된 요소
    const infoModalOverlay = document.getElementById('info-modal-overlay');
    const infoImage = document.getElementById('info-image');

    let clickCount = 0; 
    const TRIGGER_COUNT = 3; 

    function getRandomIncrease(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // =========================================================
    // 1. Order Button 클릭 이벤트
    // =========================================================
    orderButton.addEventListener('click', () => {
        
        // 1. 숫자 무작위 증가 로직
        const currentText = remainingNumberElement.textContent;
        const numberMatch = currentText.match(/(\d+)/); 
        
        let currentCount = 1000; 
        if (numberMatch) {
            currentCount = parseInt(numberMatch[0], 10);
        }

        const increaseAmount = getRandomIncrease(10, 50);
        const newCount = currentCount + increaseAmount;
        
        remainingNumberElement.textContent = `${newCount}건`;

        // 2. 숫자 흔들림 애니메이션 적용
        remainingNumberElement.classList.remove('shaking'); 
        void remainingNumberElement.offsetWidth; 
        remainingNumberElement.classList.add('shaking'); 
        
        remainingNumberElement.addEventListener('animationend', function handler() {
            remainingNumberElement.classList.remove('shaking');
            remainingNumberElement.removeEventListener('animationend', handler);
        }, { once: true });

        // 3. 클릭 횟수 및 배너/이미지 등장 로직
        clickCount++;
        if (clickCount === TRIGGER_COUNT) {
            
            // ❗ 색 반전 기능 제거 ❗

            errorBanner.classList.add('show');
            errorMessage.classList.add('active');
            
            distractionImages.forEach((img) => {
                img.classList.add('show');
                img.addEventListener('animationend', function handler() {
                    img.classList.remove('show');
                    img.classList.add('visible'); 
                    img.style.pointerEvents = 'auto'; 
                    img.removeEventListener('animationend', handler); 
                }, { once: true });
            });
        }
    });

    // =========================================================
    // 2. Information Button 클릭 이벤트 (특정 이미지(모달) 표시)
    // =========================================================
    informationButton.addEventListener('click', (event) => {
        event.stopPropagation();
        
        // 모달 표시
        infoModalOverlay.classList.add('show'); 
        
        // 혹시 다른 서브 이미지가 열려 있다면 닫음
        singleSubImages.forEach(subImg => {
            subImg.classList.remove('active');
        });
    });


    // =========================================================
    // 3. 모달 및 이미지 외부 클릭 시 닫는 로직
    // =========================================================
    document.addEventListener('click', (event) => {
        
        // 1. 정보 모달 닫기 로직: 오버레이가 보일 때, 이미지 자체가 아니고 버튼도 아니면 닫음
        if (infoModalOverlay.classList.contains('show') && 
            !infoImage.contains(event.target) && 
            event.target !== informationButton) 
        {
            infoModalOverlay.classList.remove('show');
        }


        // 2. 기존 서브 이미지 닫기 로직 (유지)
        let isClickInsideSubImage = false;
        singleSubImages.forEach(subImg => {
            if (subImg.contains(event.target) || event.target === subImg) {
                isClickInsideSubImage = true;
            }
        });

        let isClickOnDistractionImage = false;
        distractionImages.forEach(mainImg => {
            if (event.target === mainImg) {
                isClickOnDistractionImage = true;
            }
        });

        if (!isClickInsideSubImage && !isClickOnDistractionImage) {
             singleSubImages.forEach(subImg => {
                subImg.classList.remove('active');
            });
        }
    });

    // =========================================================
    // 4. Main Image 클릭 이벤트 (Sub Image 1:1 토글)
    // =========================================================
    distractionImages.forEach((mainImg, index) => {
        
        mainImg.addEventListener('click', (event) => {
            event.stopPropagation();
            
            // 모달이 열려있다면 닫음
            infoModalOverlay.classList.remove('show'); 
            
            const targetSubImage = document.getElementById(`single-sub-image-${index + 1}`);

            if (targetSubImage) {
                
                singleSubImages.forEach(subImg => {
                    if (subImg !== targetSubImage) {
                        subImg.classList.remove('active');
                    }
                });
                
                targetSubImage.classList.toggle('active');
            }
        });
    });

    // =========================================================
    // 5. 서브 이미지/정보 이미지 자체 클릭 시 닫히지 않도록 이벤트 전파 차단
    // =========================================================
    singleSubImages.forEach(subImg => {
        subImg.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    });
    
    infoImage.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});

