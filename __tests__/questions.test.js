import { getQuestions } from '../src/prompts/questions.js';

describe('Questions Module', () => {
  test('should return an array of questions', () => {
    const questions = getQuestions();
    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBeGreaterThan(0);
  });

  test('should have required question properties', () => {
    const questions = getQuestions();
    questions.forEach((question) => {
      expect(question).toHaveProperty('name');
      expect(question).toHaveProperty('message');
      expect(question).toHaveProperty('type');
    });
  });

  test('should skip project name question if provided', () => {
    const questions = getQuestions('my-project');
    const projectNameQuestion = questions.find((q) => q.name === 'projectName');
    expect(projectNameQuestion.when).toBeDefined();
  });
});
