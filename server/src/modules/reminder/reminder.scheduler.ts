
import {
  defaultReminderRules,
} from "./reminder.defaults.js";



import type {
  ReminderChannel,
  ReminderTriggerType,
} from "./reminder.constants.js";

export interface ReminderScheduleInput {
  dueDate: Date;
  triggerType: ReminderTriggerType;
  daysOffset: number;
}

export interface GeneratedReminderSchedule {
  triggerType: ReminderTriggerType;
  daysOffset: number;
  channels: ReminderChannel[];
  scheduledFor: Date;
}

export const calculateReminderSchedule = ({
  dueDate,
  triggerType,
  daysOffset,
}: ReminderScheduleInput): Date => {
  const scheduledFor = new Date(dueDate);

  scheduledFor.setHours(9, 0, 0, 0);

  switch (triggerType) {
    case "BEFORE_DUE":
      scheduledFor.setDate(
        scheduledFor.getDate() - daysOffset,
      );
      break;

    case "ON_DUE_DATE":
      break;

    case "AFTER_DUE":
      scheduledFor.setDate(
        scheduledFor.getDate() + daysOffset,
      );
      break;

    default:
      throw new Error(
        `Unsupported reminder trigger type: ${triggerType}`,
      );
  }

  return scheduledFor;
};

export const generateDefaultReminderSchedules = (
  dueDate: Date,
): GeneratedReminderSchedule[] => {
  return defaultReminderRules.map((rule) => ({
    triggerType: rule.triggerType,
    daysOffset: rule.daysOffset,
    channels: rule.channels,
    scheduledFor: calculateReminderSchedule({
      dueDate,
      triggerType: rule.triggerType,
      daysOffset: rule.daysOffset,
    }),
  }));
};