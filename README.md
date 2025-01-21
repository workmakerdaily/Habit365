# Habit 365
**Habit365**는 React Native와 Expo를 사용하여 개발된 스마트 습관 추적 애플리케이션입니다. 사용자는 매일 습관을 생성, 추적, 관리하며 진행 상황을 효율적으로 확인할 수 있습니다. Firebase를 활용하여 백엔드와 데이터베이스를 관리하고, Expo를 통해 iOS와 Android 플랫폼에서 손쉽게 배포할 수 있습니다.

<br/>

---

### 주요 기능
1. **습관 생성**

- 목표 기간과 일일 목표를 설정해 습관을 추가.
- Firebase Firestore에 데이터를 저장하여 관리.

2. **진행 상황 확인**
- Firebase 데이터와 연동된 실시간 진행률 및 통계 확인.
- 매일 체크박스를 통해 완료 여부를 기록.

3. **알림 기능**
- Expo Notifications를 활용한 푸시 알림 제공.

4. **사용자 관리**
- Firebase Authentication을 활용한 사용자 인증 및 상태 관리.

<br/>

---
### 프로젝트 구조
```graphql
Habit365/
├── src/
│   ├── App.js             # 앱의 메인 진입 파일
│   ├── components/        # 재사용 가능한 UI 컴포넌트 모음
│   │   ├── Task.js        # 개별 작업(습관) 컴포넌트
│   │   ├── Image.js       # 이미지 관련 컴포넌트
│   │   ├── Input.js       # 사용자 입력 필드 컴포넌트
│   │   ├── Button.js      # 커스텀 버튼 컴포넌트
│   │   ├── Spinner.js     # 로딩 상태 표시 컴포넌트
│   │   └── IconButton.js  # 아이콘 버튼 컴포넌트
│   │   └── index.js       # components 폴더의 중앙화된 내보내기
│   ├── contexts/          # 전역 상태 관리 컨텍스트
│   │   ├── Progress.js    # 진행 상황 관련 컨텍스트
│   │   ├── User.js        # 사용자 정보 관련 컨텍스트
│   │   └── index.js       # contexts 폴더의 중앙화된 내보내기
│   ├── navigations/       # 앱의 네비게이션 구조
│   │   ├── AuthStack.js   # 인증 관련 네비게이션 스택
│   │   ├── MainStack.js   # 메인 스택 네비게이션
│   │   ├── MainTab.js     # 메인 탭 네비게이션
│   │   └── index.js       # navigations 폴더의 중앙화된 내보내기
│   ├── screens/           # 주요 화면 컴포넌트
│   │   ├── Login.js       # 로그인 화면
│   │   ├── Signup.js      # 회원가입 화면
│   │   ├── HabitAdd.js    # 습관 추가 화면
│   │   ├── HabitHome.js   # 습관 홈 화면
│   │   ├── HabitDetail.js # 습관 상세 화면
│   │   ├── NotificationMain.js # 알림 메인 화면
│   │   └── index.js       # screens 폴더의 중앙화된 내보내기
│   ├── utils/             # 유틸리티 함수 및 설정
│   │   ├── common.js      # 공통 함수 및 상수
│   │   ├── firebase.js    # Firebase 설정 및 함수
│   │   ├── images.js      # 이미지 관리 유틸리티
│   │   └── Notification.js# 알림 관련 유틸리티
├── firebaseConfig.js      # Firebase 프로젝트 설정 파일
├── App.js                 # 앱의 전체 초기화 및 엔트리 포인트
├── package.json           # 프로젝트 설정 및 의존성 관리
├── README.md              # 프로젝트 설명 파일
```

<br/>

---

### 기술 스택
- **프론트엔드**: React Native, Expo, TypeScript
- **백엔드 및 데이터베이스**: Firebase (Firestore)
- **알림 서비스**: Expo Notifications
- **스타일링**: styled-components

<br/>

---

### 주요 라이브러리
- **react-native**: React Native를 사용해 크로스 플랫폼 모바일 UI를 구현
- **expo**: 빠른 개발, 테스트 및 배포를 지원하는 플랫폼
- **styled-components**: CSS-in-JS 방식으로 컴포넌트 기반의 스타일링을 제공
- **firebase**: Firebase Authentication을 사용한 사용자 인증과 Firestore를 통한 데이터베이스 관리에 사용
- **expo-notifications**: 로컬 및 푸시 알림을 처리하여 사용자 알림을 제공
- **@react-navigation/native**: 앱 내 화면 전환 및 네비게이션을 관리
- **@react-native-async-storage/async-storage**: 로컬 데이터 저장 및 관리에 사용
- **react-hook-form**: 폼 상태와 유효성 검사를 간단하게 관리할 수 있도록 도와줌줌
- **expo-linear-gradient**: 앱 UI를 개선하기 위해 배경에 그라디언트 효과를 추가
- **expo-image-picker**: 사용자 프로필 사진 업로드 및 이미지 선택 기능을 제공