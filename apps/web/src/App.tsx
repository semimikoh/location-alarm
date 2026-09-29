import { ALARM_RADIUS, type AlarmDraft } from '@location-alarm/shared';
import './App.css';

const draft: AlarmDraft = {
  id: null,
  label: '',
  placeName: '',
  latitude: null,
  longitude: null,
  radius: ALARM_RADIUS.default,
  enabled: true,
  soundId: 'default',
  vibrate: true,
  repeat: true,
  repeatDays: [1, 2, 3, 4, 5],
  windowStart: '07:00',
  windowEnd: '10:00',
};

function App() {
  return (
    <div className="alarm-create">
      <header className="alarm-create__header">
        <span className="alarm-create__eyebrow">위치 알람</span>
        <h1>알람 생성</h1>
      </header>

      <main className="alarm-create__content">
        <div className="alarm-create__placeholder" aria-hidden="true">
          ◎
        </div>
        <h2>알람을 만들 장소를 골라주세요</h2>
        <p>
          기본 반경 {draft.radius}m · 지도와 장소 검색 화면이 준비 중이에요.
        </p>
      </main>
    </div>
  );
}

export default App;
