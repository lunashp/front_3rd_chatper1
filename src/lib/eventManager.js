// // eventManager.js

// // 이벤트 위임을 위한 전역 이벤트 맵
// // 이 맵은 이벤트 타입별로 요소와 해당 요소의 이벤트 핸들러를 저장합니다.
// const eventMap = new Map();

// // 이벤트 위임이 설정될 루트 요소
// let rootElement = null;

// // TODO: setupEventListeners 함수 구현
// // 이 함수는 루트 요소에 이벤트 위임을 설정합니다.
// export function setupEventListeners(root) {
//   // 1. rootElement 설정
//   // 2. 기존에 설정된 이벤트 리스너 제거 (있다면)
//   // 3. eventMap에 등록된 모든 이벤트 타입에 대해 루트 요소에 이벤트 리스너 추가
//   // 주의: 이벤트 캡처링을 사용하여 이벤트를 상위에서 하위로 전파
// }

// // TODO: handleEvent 함수 구현
// // 이 함수는 실제 이벤트가 발생했을 때 호출되는 핸들러입니다.
// function handleEvent(event) {
//   // 1. 이벤트 타겟에서 시작하여 루트 요소까지 버블링
//   // 2. 각 요소에 대해 해당 이벤트 타입의 핸들러가 있는지 확인
//   // 3. 핸들러가 있다면 실행
//   // 이를 통해 하위 요소에서 발생한 이벤트를 상위에서 효율적으로 처리할 수 있습니다.
// }

// // TODO: addEvent 함수 구현
// export function addEvent(element, eventType, handler) {
//   // 1. eventMap에 이벤트 타입과 요소, 핸들러 정보 저장
//   // 2. 필요한 경우 루트 요소에 새 이벤트 리스너 추가
//   // 이 함수를 통해 개별 요소에 직접 이벤트를 붙이지 않고도 이벤트 처리 가능
// }

// // TODO: removeEvent 함수 구현
// export function removeEvent(element, eventType, handler) {
//   // 1. eventMap에서 해당 요소와 이벤트 타입에 대한 핸들러 제거
//   // 2. 해당 이벤트 타입의 모든 핸들러가 제거되면 루트 요소의 리스너도 제거
//   // 이를 통해 더 이상 필요 없는 이벤트 핸들러를 정리하고 메모리 누수 방지
// }

// 이벤트 위임을 위한 전역 이벤트 맵
const eventMap = new Map();

// 이벤트 위임이 설정될 루트 요소
let rootElement = null;

// setupEventListeners 함수 구현
export function setupEventListeners(root) {
  // 1. rootElement 설정
  rootElement = root;

  // 2. 기존에 설정된 이벤트 리스너 제거 (있다면)
  if (rootElement._eventListeners) {
    for (const eventType of eventMap.keys()) {
      rootElement.removeEventListener(eventType, handleEvent, true);
    }
  }

  // 3. eventMap에 등록된 모든 이벤트 타입에 대해 루트 요소에 이벤트 리스너 추가
  for (const eventType of eventMap.keys()) {
    rootElement.addEventListener(eventType, handleEvent, true);
  }

  // 이벤트 리스너 저장
  rootElement._eventListener = true;
}

// handleEvent 함수 구현
function handleEvent(event) {
  const { type, target } = event;
  let currentElement = target;

  // 1. 이벤트 타겟에서 시작하여 루트 요소까지 버블링
  while (currentElement && currentElement !== rootElement) {
    // 2. 각 요소에 대해 해당 이벤트 타입의 핸들러가 있는지 확인
    const handlers = eventMap.get(type);
    if (handlers && handlers.has(currentElement)) {
      const handler = handlers.get(currentElement);
      // 3. 핸들러가 있다면 실행
      handler(event);
    }
    currentElement = currentElement.parentNode; // 상위 요소로 이동
  }
}

// addEvent 함수 구현
export function addEvent(element, eventType, handler) {
  // 1. eventMap에 이벤트 타입과 요소, 핸들러 정보 저장
  if (!eventMap.has(eventType)) {
    eventMap.set(eventType, new Map());
  }

  const handlers = eventMap.get(eventType);
  handlers.set(element, handler);

  //   // 2. 필요한 경우 루트 요소에 새 이벤트 리스너 추가
  //   if (!rootElement) {
  //     return; // 루트가 설정되지 않은 경우
  //   }
  //   if (!rootElement._eventListener) {
  //     rootElement.addEventListener(eventType, handleEvent, true); // 캡처링 사용
  //     rootElement._eventListener = true;
  //   }
  // }
  if (!rootElement || !rootElement._eventListeners) {
    setupEventListeners(rootElement);
  }
}

// removeEvent 함수 구현
export function removeEvent(element, eventType) {
  // 1. eventMap에서 해당 요소와 이벤트 타입에 대한 핸들러 제거
  if (eventMap.has(eventType)) {
    const handlers = eventMap.get(eventType);
    if (handlers.has(element)) {
      handlers.delete(element);
    }

    // 2. 해당 이벤트 타입의 모든 핸들러가 제거되면 루트 요소의 리스너도 제거
    if (handlers.size === 0) {
      rootElement.removeEventListener(eventType, handleEvent, true);
      eventMap.delete(eventType);
      if (eventMap.size === 0) {
        rootElement._eventListeners = false;
      }
    }
  }
}
