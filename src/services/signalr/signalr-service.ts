export { signalRService, signalRManager } from './signalr-manager';

// Individual services for advanced use cases
export { chatSignalRService } from './feature/chat-service-signalr';
export { notificationSignalRService } from './feature/notification-service-signalr';
export { unboxingSignalRService} from "./feature/unboxing-service-signalr"

export { signalRService as default } from './signalr-manager';