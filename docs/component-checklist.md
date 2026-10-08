# 공통 컴포넌트 갤러리 체크리스트

이 문서는 설계 자료의 `design/component-guide.md`에 정리된 컴포넌트와 fixture 진입점을 연결한다. fixture 동작은 화면만 바꾸며 DB 저장, 위치 감시, 알림 등록을 호출하지 않는다.

## 갤러리 진입

- **네이티브:** 개발 빌드 첫 화면의 `컴포넌트 확인` 버튼. `__DEV__`일 때만 보인다.
- **웹:** `apps/web` 개발 서버의 `/` 경로. 편집 화면의 상태 선택 버튼으로 fixture를 바꾼다.
- **확인:** 화면에서 반복·1회용, 지도 로딩·실패, 검색 결과 없음, 오프라인, 저장 중·비활성 상태를 선택한다. 수동 위경도 입력은 선택 좌표와 저장 가능 상태에 반영된다.

## 컴포넌트 연결표

| 설계 항목                  | 구현                                                                                                                       | 갤러리 fixture                                           |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `ActionButton`             | [네이티브](../apps/mobile/src/components/ActionButton.tsx) · [웹](../apps/web/src/components/EditorComponents.tsx)         | 네이티브 버튼과 상태 섹션 · 웹 저장 버튼                 |
| `AlarmToggle`              | [네이티브](../apps/mobile/src/components/AlarmToggle.tsx)                                                                  | 알람 카드 상태 섹션                                      |
| `AlarmCard`                | [네이티브](../apps/mobile/src/components/AlarmCard.tsx)                                                                    | 반복·오늘 울림·1회용·긴 이름·등록 중·실패·권한 거부·한도 |
| `ScreenHeader`             | [네이티브](../apps/mobile/src/components/ScreenHeader.tsx) · [웹](../apps/web/src/components/EditorComponents.tsx)         | 네이티브 갤러리 · 웹 편집 미리보기                       |
| `FixedActionBar`           | [웹](../apps/web/src/components/EditorComponents.tsx)                                                                      | 반복·1회용 및 저장 상태                                  |
| `TextField`                | [웹](../apps/web/src/components/EditorComponents.tsx)                                                                      | 이름·장소 검색·수동 위경도                               |
| `DayPicker` / `DaySummary` | [웹 선택](../apps/web/src/components/EditorComponents.tsx) · [네이티브 요약](../apps/mobile/src/components/DaySummary.tsx) | 반복 편집 · 알람 카드                                    |
| `TimeWindowField`          | [웹](../apps/web/src/components/EditorComponents.tsx)                                                                      | 반복 편집 및 잘못된 시간대                               |
| `RadiusSlider`             | [웹](../apps/web/src/components/EditorComponents.tsx)                                                                      | 편집 미리보기                                            |
| `PlacePicker`              | [웹](../apps/web/src/components/EditorComponents.tsx)                                                                      | 장소 검색 결과·빈 결과·저장 장소·수동 좌표               |
| `StatusBanner`             | [네이티브](../apps/mobile/src/components/StatusBanner.tsx) · [웹](../apps/web/src/components/EditorComponents.tsx)         | 네이티브 권한·등록 오류 · 웹 오프라인·저장 안내          |
| `EmptyState`               | [네이티브](../apps/mobile/src/components/EmptyState.tsx)                                                                   | 빈 목록                                                  |
| `MapState`                 | [웹](../apps/web/src/components/EditorComponents.tsx)                                                                      | 지도 준비·로딩·실패·오프라인                             |
| `LimitSheet`               | [네이티브](../apps/mobile/src/components/LimitSheet.tsx)                                                                   | 등록 한도 보기                                           |
| `SettingsRow`              | [네이티브](../apps/mobile/src/components/SettingsRow.tsx)                                                                  | 설정과 한도                                              |
| `LoadingMark`              | [네이티브](../apps/mobile/src/components/LoadingMark.tsx)                                                                  | 정상 로딩·재시도 오류                                    |
| `EmergencyAlarmList`       | [네이티브](../apps/mobile/src/components/EmergencyAlarmList.tsx)                                                           | 비상 목록                                                |
| 알람 울림 화면 조합        | [네이티브 fixture](../apps/mobile/src/fixtures/NativeFixturePreview.tsx)                                                   | 위치 도착 안내·알람 이름·종료 버튼                       |

## 캔버스 상태 확인

- [x] 알람 목록: 빈 목록, 반복/1회용, 오늘 울림, 긴 이름, 등록 중·실패
- [x] 설정과 권한: 권한 안내, 기본 반경, 복구 행동
- [x] 알람 울림: 위치 도착 안내와 종료 버튼
- [x] 지오펜스 한도: 현재 수와 한도, 켜진 알람 보기 행동
- [x] 비상 목록: 웹뷰 대신 네이티브 목록과 재시도
- [x] 웹 편집: 반복·1회용, 지도 로딩·실패, 검색 빈 결과, 오프라인, 저장 중·비활성
