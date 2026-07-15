/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Quiz, QUIZZES } from '../data/quizzes';
import { QuizAnswer } from '../types';
import { ArrowRight, BookOpen, Music, Home, Heart, Compass, Clock, CheckCircle } from 'lucide-react';

interface QuizOnboardingProps {
  onComplete: (answers: QuizAnswer[]) => void;
}

export default function QuizOnboarding({ onComplete }: QuizOnboardingProps) {
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showReflection, setShowReflection] = useState(false);

  const currentQuiz = QUIZZES[currentQuizIdx];
  const currentQuestion = currentQuiz.questions[currentQuestionIdx];
  const totalQuestions = QUIZZES.length * 5;
  const questionsAnswered = currentQuizIdx * 5 + currentQuestionIdx;
  const progressPercent = Math.round((questionsAnswered / totalQuestions) * 100);

  const getDimensionIcon = (dim: string) => {
    switch (dim) {
      case 'SONIC': return <Music className="text-brand-terracotta" size={24} />;
      case 'HABITAT': return <Home className="text-brand-clay" size={24} />;
      case 'LOVE': return <Heart className="text-red-500" size={24} />;
      case 'VALUES': return <Compass className="text-amber-600" size={24} />;
      case 'TIME': return <Clock className="text-blue-500" size={24} />;
      default: return <BookOpen size={24} />;
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    // Save answer
    const newAnswer: QuizAnswer = {
      id: `ans-${currentQuiz.id}-${currentQuestion.num}`,
      userId: 'temp-user',
      quizId: currentQuiz.id,
      questionNum: currentQuestion.num,
      answer: optionIndex,
    };

    const nextAnswers = [...answers, newAnswer];
    setAnswers(nextAnswers);

    if (currentQuestionIdx < 4) {
      // Go to next question in same quiz
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Finished the current quiz dimension
      setShowReflection(true);
    }
  };

  // Determine the reflection string based on the user's answers for this current quiz
  const getReflectionCopy = () => {
    const currentQuizAnswers = answers.filter(a => a.quizId === currentQuiz.id);
    const count: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
    currentQuizAnswers.forEach(a => {
      count[a.answer] = (count[a.answer] || 0) + 1;
    });

    if (currentQuiz.dimension === 'SONIC') {
      if (count[0] >= 3) return currentQuiz.reflections.mostlyA;
      if (count[1] + count[2] >= 3) return currentQuiz.reflections.mostlyBC;
      return currentQuiz.reflections.mostlyD;
    } else if (currentQuiz.dimension === 'HABITAT') {
      if (count[0] + count[2] >= 3) return currentQuiz.reflections.homeCentered;
      if (count[1] >= 3) return currentQuiz.reflections.earlyActive;
      return currentQuiz.reflections.nightOwl;
    } else if (currentQuiz.dimension === 'LOVE') {
      if (count[0] + count[4] >= 3) return currentQuiz.reflections.fastResolver;
      if (count[2] >= 3) return currentQuiz.reflections.physicalPresent;
      return currentQuiz.reflections.spaceGiver;
    } else if (currentQuiz.dimension === 'VALUES') {
      if (count[0] + count[1] >= 3) return currentQuiz.reflections.rootsFirst;
      if (count[4] >= 3) return currentQuiz.reflections.builderMover;
      return currentQuiz.reflections.separateLanes;
    } else {
      // TIME
      if (count[0] >= 3) return currentQuiz.reflections.makerCreator;
      if (count[2] >= 3) return currentQuiz.reflections.moverActive;
      return currentQuiz.reflections.soloRich;
    }
  };

  const handleNextQuiz = () => {
    setShowReflection(false);
    setCurrentQuestionIdx(0);
    
    if (currentQuizIdx < QUIZZES.length - 1) {
      setCurrentQuizIdx(currentQuizIdx + 1);
    } else {
      // All 5 quizzes completed!
      onComplete(answers);
    }
  };

  return (
    <div id="quiz-container" className="max-w-2xl mx-auto">
      {/* Top Progress bar */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-brand-stone">
          <span>Onboarding Progress</span>
          <span>{questionsAnswered} / {totalQuestions} Questions</span>
        </div>
        <div className="w-full bg-[#E5DED4] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-brand-terracotta h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {!showReflection ? (
        <div className="bg-brand-cream border border-[#F0E8DC] rounded-3xl p-8 md:p-12 shadow-xs space-y-8 text-left animate-fade-in">
          {/* Dimension indicator */}
          <div className="flex items-center gap-3 border-b border-[#F0E8DC] pb-4">
            {getDimensionIcon(currentQuiz.dimension)}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-stone">
                Dimension {currentQuizIdx + 1} of 5
              </span>
              <h3 className="text-lg font-display font-bold text-brand-charcoal capitalize">
                {currentQuiz.name}
              </h3>
            </div>
          </div>

          {/* Question text */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-brand-clay font-bold uppercase tracking-widest">
              Scenario {currentQuestion.num}
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-medium text-brand-charcoal italic tracking-tight leading-relaxed">
              "{currentQuestion.text}"
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 pt-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                id={`quiz-option-${idx}`}
                onClick={() => handleSelectOption(idx)}
                className="w-full text-left p-5 rounded-2xl bg-brand-cream border border-[#E5DED4] hover:bg-brand-charcoal hover:border-brand-charcoal hover:text-brand-beige transition-all duration-200 text-sm md:text-base font-medium flex items-center justify-between group active:scale-[0.99]"
              >
                <span>{option}</span>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-mono shrink-0 ml-3 group-hover:bg-brand-terracotta group-hover:border-brand-terracotta group-hover:text-white">
                  {String.fromCharCode(65 + idx)}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Dimension Completed Reflection Card */
        <div className="bg-brand-cream border-2 border-brand-charcoal rounded-3xl p-8 md:p-12 shadow-md text-center space-y-8 animate-fade-in">
          <div className="w-16 h-16 bg-brand-charcoal text-brand-beige rounded-full flex items-center justify-center mx-auto shadow-sm">
            {getDimensionIcon(currentQuiz.dimension)}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-clay">
              Section Reflection Complete
            </span>
            <h2 className="text-4xl font-display font-semibold text-brand-charcoal">
              how you {currentQuiz.dimension.toLowerCase()}
            </h2>
          </div>

          <div className="p-6 bg-brand-beige rounded-2xl max-w-lg mx-auto border border-[#E5DED4]">
            <p className="text-xs font-mono uppercase tracking-widest text-brand-stone mb-3">
              We parsed your behavior:
            </p>
            <p className="text-xl font-display text-brand-charcoal italic leading-relaxed">
              "{getReflectionCopy()}"
            </p>
          </div>

          <div className="text-xs text-brand-stone max-w-md mx-auto font-light">
            <strong>What this reveals:</strong> {currentQuiz.reveals}
          </div>

          <button
            onClick={handleNextQuiz}
            className="px-8 py-4 bg-brand-charcoal text-brand-beige font-semibold rounded-full hover:bg-brand-terracotta hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center gap-2 shadow-sm"
          >
            {currentQuizIdx < QUIZZES.length - 1 ? 'Unlock Next Dimension' : 'Generate Match Profile'}
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
