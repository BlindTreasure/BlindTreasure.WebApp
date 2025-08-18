const UNBOX = "/unboxing";
const UNBOX_WITH_ID = (customerBlindBoxId: string) => `${UNBOX}/${customerBlindBoxId}`;
const UNBOX_LOGS = `${UNBOX}/unbox-logs`;
const EXPORT_UNBOX_LOGS = `${UNBOX}/export-logs`;

export default {
  UNBOX,
  UNBOX_WITH_ID,
  UNBOX_LOGS,
  EXPORT_UNBOX_LOGS,
};
