const BLINDBOXES_All = "/blind-boxes";
const BLINDBOXES_All_WITH_ID = (blindboxesId: string) =>
  `${BLINDBOXES_All}/${blindboxesId}`;
const ADD_ITEMS = (blindboxesId: string) => `${BLINDBOXES_All}/${blindboxesId}/items`;
const DELETE_ITEMS = (blindboxesId: string) => `${BLINDBOXES_All}/${blindboxesId}/items`;
const SUBMIT_FORM = (blindboxesId: string) => `${BLINDBOXES_All}/${blindboxesId}/submit`;

export default {
  BLINDBOXES_All,
  BLINDBOXES_All_WITH_ID,
  ADD_ITEMS,
  DELETE_ITEMS,
  SUBMIT_FORM
};



