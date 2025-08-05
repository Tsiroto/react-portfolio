export type DeviceType = 'mobile' | 'desktop';
export type InputMethod = 'touch' | 'keyboard';

export interface GlowingPromptProps {
    deviceType: InputMethod; // or `DeviceType` if you're passing mobile/desktop
    onStart: () => void;
}
