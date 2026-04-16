import { Theater } from "./theater";

export type Hall = {
  id: string;
  theater_id: string;
  name: string | null;
  theaters: Theater;
};