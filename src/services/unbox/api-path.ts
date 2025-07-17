const UNBOX = "/unboxing";
const UNBOX_WITH_ID = (customerBlindBoxId: string) => `${UNBOX}/${customerBlindBoxId}`;
const UNBOX_LOGS = `${UNBOX}/unbox-logs`;

export default {
  UNBOX,
  UNBOX_WITH_ID,
  UNBOX_LOGS,
};
