/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Gender {
  WOMAN = "WOMAN",
  MAN = "MAN",
  NONBINARY = "NONBINARY",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY"
}

export enum Dimension {
  SONIC = "SONIC",
  HABITAT = "HABITAT",
  LOVE = "LOVE",
  VALUES = "VALUES",
  TIME = "TIME"
}

export enum AppearanceType {
  THIS_IS_ME = "THIS_IS_ME",
  DRAWN_TO = "DRAWN_TO"
}

export enum MatchAction {
  LIKE = "LIKE",
  PASS = "PASS"
}

export enum MatchStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
  BLOCKED = "BLOCKED"
}

export enum MessageType {
  TEXT = "TEXT",
  PHOTO = "PHOTO"
}

export enum PurchaseType {
  QUEUE_BOOST = "QUEUE_BOOST",
  INSIGHTS = "INSIGHTS",
  SUCCESS_DONATION = "SUCCESS_DONATION"
}

export enum PurchaseStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REFUNDED = "REFUNDED"
}

export interface Photo {
  id: string;
  userId: string;
  url: string;
  publicId: string;
  order: number;
}

export interface QuizAnswer {
  id: string;
  userId: string;
  quizId: number; // 1 - 5
  questionNum: number; // 1 - 5
  answer: number; // 0 - 3 (A=0, B=1, C=2, D=3)
}

export interface DimensionScore {
  id: string;
  userId: string;
  dimension: Dimension;
  score: number; // 0.0 - 1.0
}

export interface UserChip {
  id: string;
  userId: string;
  chip: string;
  custom: boolean;
  approved: boolean;
}

export interface AppearanceChip {
  id: string;
  userId: string;
  chip: string;
  type: AppearanceType;
}

export interface User {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  phoneNumber: string;
  phoneVerified: boolean;
  photoVerified: boolean;
  verificationAttempts: number;
  flaggedForReview: boolean;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  locationRadius: number; // miles
  ageRangeMin: number;
  ageRangeMax: number;
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
  photos: Photo[];
  quizAnswers: QuizAnswer[];
  dimensionScores: DimensionScore[];
  interestChips: UserChip[];
  appearanceChips: AppearanceChip[];
}

export interface Match {
  id: string;
  userAId: string;
  userBId: string;
  compatibilityScore: number; // raw algorithm score 0-100
  displayScore: number; // remapped score shown to users 70-99
  tags: string[]; // 3 behavioral tags
  surfacedAt: Date;
  aAction: MatchAction | null;
  bAction: MatchAction | null;
  aActionedAt: Date | null;
  bActionedAt: Date | null;
  status: MatchStatus;
  suppressUntil: Date | null;
  updatedAt: Date;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  type: MessageType;
  readAt: Date | null;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface CommunicationPref {
  id: string;
  matchId: string;
  userId: string;
  voiceEnabled: boolean;
  videoEnabled: boolean;
  smsEnabled: boolean;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  type: PurchaseType;
  stripePaymentId: string;
  amount: number; // cents
  status: PurchaseStatus;
  createdAt: Date;
}
