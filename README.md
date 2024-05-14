# 서비스 바로가기

- [Crypto-Chart](https://crypto-currency-charts.netlify.app/)

# Table Of Contents(TOC)

- [ProjectName](#Project)
- [TeamIntrtroduction](#TeamIntrtroduction)
- [HowToWork](#HowToWork)
- [ProjectSettings](#ProjectSettings)
- [Usage](#Usage)
- [ReferenceDocument](#Reference-Document)

# Project

## Name

Crypto-Chart

# Project Description

Crypto-Chart는 실시간 암호화폐 정보를 사용자에게 제공하는 웹 애플리케이션입니다. 이 서비스를 통해 사용자는 다음과 같은 기능을 이용할 수 있습니다:

- **실시간 암호화폐 정보 확인**: 가장 최근의 암호화폐 가격, 변동성 등을 실시간으로 확인할 수 있습니다.
- **차트 기반 시각화**: 선택한 암호화폐의 가격 변동을 차트를 통해 시각적으로 파악할 수 있습니다. 이 차트는 시간대별로 구분하여 다양한 시점에서의 데이터를 제공합니다.
- **다양한 암호화폐 지원**: Bitcoin, Ethereum 등 여러 주요 암호화폐들을 지원하며, 사용자는 원하는 암호화폐를 리스트에서 선택할 수 있습니다.
- **사용자 친화적 인터페이스**: 직관적인 UI를 통해 모든 연령대의 사용자가 쉽게 정보를 조회하고 이해할 수 있습니다.

### 스크린샷

## Project Skill

<div>
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
<br/>
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<br/>
<img src="https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white">
<img src="https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
<br/>
<img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white">
<br />
<img src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white">

<img src="https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white">
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/tailwind-181717?style=for-the-badge&logo=tailwindcss&logoColor=blue">

# How To Work

## 강수영

### 웹소켓을 이용한 실시간 데이터 처리

- **API 연결**: 웹소켓을 통해 암호화폐의 실시간 가격 데이터를 받아오는 API를 구현하였습니다. 이를 통해 사용자는 최신 시장 동향을 빠르게 파악할 수 있습니다.
- **암호화폐 리스트 정보 조회**: 서버에서 제공하는 다양한 암호화폐에 대한 정보를 조회하는 API를 연결하였습니다. 사용자는 이 리스트를 통해 원하는 암호화폐를 쉽게 찾을 수 있습니다.

### 프론트엔드 구현

- **리스트 기반 암호화폐 선택 기능**: 사용자가 암호화폐 리스트에서 원하는 암호화폐를 선택하면, 해당 암호화폐에 대한 상세 정보를 즉각적으로 볼 수 있도록 구현하였습니다.

### 데이터 관리

- **싱글턴 패턴 적용**: 암호화폐 정보의 상태 관리를 위해 싱글턴 패턴을 적용하였습니다. 이 패턴은 애플리케이션 내에서 일관된 상태를 유지하며 데이터 접근을 통제하므로, 데이터 일관성과 성능 향상에 기여합니다.

## 팀원 2

# Project Settings

1. 프로젝트 세팅 작성

## Project Folder Structure

```
📦src
 ┣ 📂components
 ┃ ┣ 📂chart
 ┃ ┃ ┣ 📜CryptoChart.tsx
 ┃ ┃ ┣ 📜CurrentTime.tsx
 ┃ ┃ ┗ 📜TimeSelector.tsx
 ┃ ┣ 📂tests
 ┃ ┃ ┣ 📜CoinList.spec.tsx
 ┃ ┃ ┗ 📜InfoBox.spec.tsx
 ┃ ┣ 📜ChartContainer.tsx
 ┃ ┣ 📜Coin.tsx
 ┃ ┣ 📜CoinList.tsx
 ┃ ┣ 📜InfoBox.tsx
 ┃ ┗ 📜Layout.tsx
 ┣ 📂constants
 ┃ ┗ 📜url.ts
 ┣ 📂hooks
 ┃ ┗ 📂crypto
 ┃ ┃ ┣ 📜useCheckDrag.ts
 ┃ ┃ ┣ 📜useFetchPrices.ts
 ┃ ┃ ┣ 📜useStorePrices.ts
 ┃ ┃ ┗ 📜useWebsocket.ts
 ┣ 📂model
 ┃ ┣ 📜ticker.ts
 ┃ ┗ 📜time.ts
 ┣ 📂pages
 ┃ ┗ 📜Exchages.tsx
 ┣ 📂services
 ┃ ┗ 📜DataFeed.ts
 ┣ 📂store
 ┃ ┗ 📜time.store.ts
 ┣ 📂types
 ┃ ┗ 📜crypto.type.ts
 ┣ 📂utils
 ┃ ┣ 📂date
 ┃ ┃ ┗ 📜date.ts
 ┃ ┣ 📜format.ts
 ┃ ┗ 📜websocket.ts
 ┣ 📜App.css
 ┣ 📜App.tsx
 ┣ 📜index.css
 ┣ 📜main.tsx
 ┣ 📜utils.ts
 ┗ 📜vite-env.d.ts
```

1. git clone

```js
  git clone https://github.com/hanghae-3/crypto_chart.git
```

2. crypto_chart 폴더를 인터프린터나 컴파일러로 열기
3. 필요한 라이브러리 설치

```
npm install
```

4. 실행

```
npm run dev

```

# Reference Document

1. 업비트 api 제공사이트(https://docs.upbit.com/docs/market-all)
