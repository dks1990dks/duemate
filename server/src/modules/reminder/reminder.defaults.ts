import type {
  ReminderChannel,
  ReminderTriggerType,
} from "./reminder.constants.js";

export interface DefaultReminderRule {
  triggerType: ReminderTriggerType;
  daysOffset: number;
  channels: ReminderChannel[];
}

const defaultReminderChannels: ReminderChannel[] = [
  "IN_APP",
  "EMAIL",
  "SMS",
  "WHATSAPP",
];

export const defaultReminderRules: DefaultReminderRule[] = [
  {
    triggerType: "BEFORE_DUE",
    daysOffset: 7,
    channels: defaultReminderChannels,
  },

  {
    triggerType: "BEFORE_DUE",
    daysOffset: 3,
    channels: defaultReminderChannels,
  },

  {
    triggerType: "BEFORE_DUE",
    daysOffset: 1,
    channels: defaultReminderChannels,
  },

  {
    triggerType: "ON_DUE_DATE",
    daysOffset: 0,
    channels: defaultReminderChannels,
  },

  {
    triggerType: "AFTER_DUE",
    daysOffset: 1,
    channels: defaultReminderChannels,
  },
];
