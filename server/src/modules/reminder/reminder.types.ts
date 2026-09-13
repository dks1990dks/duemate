import type {
  ReminderChannel,
  ReminderStatus,
  ReminderTriggerType,
} from "./reminder.constants.js";

export interface ReminderRuleInput {
  triggerType: ReminderTriggerType;

  /**
   * Number of days relative to the obligation due date.
   *
   * BEFORE_DUE:
   * 7 = 7 days before
   *
   * ON_DUE_DATE:
   * 0
   *
   * AFTER_DUE:
   * 1 = 1 day after
   */
  daysOffset: number;

  channels: ReminderChannel[];
}


export interface CreateReminderData {
  obligationId: string;

  triggerType: ReminderTriggerType;

  daysOffset: number;

  channels: ReminderChannel[];

  scheduledFor: Date;
}


export interface UpdateReminderData {
  channels?: ReminderChannel[];

  scheduledFor?: Date;

  status?: ReminderStatus;
}


export interface ReminderProcessingResult {
  reminderId: string;

  success: boolean;

  message?: string;
}