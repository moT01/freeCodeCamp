// Package Utilities
import { Grid, Col, Row, Button } from '@freecodecamp/react-bootstrap';
import { graphql } from 'gatsby';
import React, { Component, RefObject } from 'react';
import Helmet from 'react-helmet';
import type { TFunction } from 'i18next';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import { createSelector } from 'reselect';

// Local Utilities
import Spacer from '../../../components/helpers/spacer';
import LearnLayout from '../../../components/layouts/learn';
import ChallengeTitle from '../components/challenge-title';
import PrismFormatted from '../components/prism-formatted';
import CompletionModal from '../components/completion-modal';
import HelpModal from '../components/help-modal';
import Hotkeys from '../components/hotkeys';
import { startExam, stopExam } from '../../../redux/actions';
import {
  completedChallengesSelector,
  partiallyCompletedChallengesSelector,
  isSignedInSelector,
  examInProgressSelector
} from '../../../redux/selectors';
import {
  challengeMounted,
  updateChallengeMeta,
  openModal,
  closeModal,
  submitChallenge,
  setExamResults,
  updateSolutionFormValues
} from '../redux/actions';
import { isChallengeCompletedSelector } from '../redux/selectors';
import { createFlashMessage } from '../../../components/Flash/redux';
import {
  ChallengeNode,
  ChallengeMeta,
  CompletedChallenge
} from '../../../redux/prop-types';
import FinishExamModal from './components/finish-exam-modal';
import ExamResults from './components/exam-results';

import './exam.css';

// Redux
const mapStateToProps = createSelector(
  completedChallengesSelector,
  isChallengeCompletedSelector,
  isSignedInSelector,
  partiallyCompletedChallengesSelector,
  examInProgressSelector,
  (
    completedChallenges: CompletedChallenge[],
    isChallengeCompleted: boolean,
    isSignedIn: boolean,
    partiallyCompletedChallenges: CompletedChallenge[],
    examInProgress: boolean
  ) => ({
    completedChallenges,
    isChallengeCompleted,
    isSignedIn,
    partiallyCompletedChallenges,
    examInProgress
  })
);

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      challengeMounted,
      createFlashMessage,
      openFinishExamModal: () => openModal('finishExam'),
      closeFinishExamModal: () => closeModal('finishExam'),
      startExam,
      stopExam,
      setExamResults,
      submitChallenge,
      updateChallengeMeta,
      updateSolutionFormValues
    },
    dispatch
  );

// Types
interface ShowExamProps {
  challengeMounted: (arg0: string) => void;
  completedChallenges: CompletedChallenge[];
  createFlashMessage: typeof createFlashMessage;
  data: { challengeNode: ChallengeNode };
  examInProgress: boolean;
  isChallengeCompleted: boolean;
  isSignedIn: boolean;
  openFinishExamModal: () => void;
  closeFinishExamModal: () => void;
  pageContext: {
    challengeMeta: ChallengeMeta;
  };
  t: TFunction;
  startExam: () => void;
  stopExam: () => void;
  submitChallenge: () => void;
  setExamResults: (arg0: ExamResults) => void;
  updateChallengeMeta: (arg0: ChallengeMeta) => void;
}

interface ShowExamState {
  currentQuestionIndex: number;
  examTimeInSeconds: number;
  generatedExam: GeneratedExamQuestion[];
  userExam: UserExamQuestion[];
  showResults: boolean;
}

interface GeneratedExamQuestion {
  question: string;
  answers: string[];
}

interface UserExamQuestion {
  question: string;
  answer: string | null;
}

interface ExamResultQuestion {
  question: string;
  answer: string;
  correct: boolean;
}

interface ExamResults {
  timeInSeconds: number;
  results: ExamResultQuestion[];
}

const examInDatabase = [
  {
    question: 'What does C# stand for?',
    wrongAnswers: ['Computer Science', 'C Shell', 'C Style', 'C Syntax'],
    correctAnswer: 'C Sharp'
  },
  {
    question: 'Which company developed C#?',
    wrongAnswers: ['Apple', 'Google', 'Amazon'],
    correctAnswer: 'Microsoft'
  },
  {
    question: 'What is the latest version of C# as of 2023?',
    wrongAnswers: ['C# 6.0', 'C# 7.0', 'C# 8.0', 'C# 9.0'],
    correctAnswer: 'C# 10.0'
  },
  {
    question: 'Which programming paradigm does C# primarily support?',
    wrongAnswers: ['Imperative', 'Functional', 'Procedural', 'Logical'],
    correctAnswer: 'Object-oriented'
  },
  {
    question: 'What is the default access modifier for members of a class in C#?',
    wrongAnswers: ['public', 'internal', 'protected'],
    correctAnswer: 'private'
  },
  {
    question: 'Which tool is used to compile C# code?',
    wrongAnswers: ['Java Compiler', 'Ruby Interpreter', 'C++ Compiler', 'Python Interpreter'],
    correctAnswer: 'C# Compiler'
  },
  {
    question: 'What is the file extension for a C# source code file?',
    wrongAnswers: ['.cpp', '.java', '.cshtml', '.txt'],
    correctAnswer: '.cs'
  },
  {
    question: 'Which keyword is used to define a class in C#?',
    wrongAnswers: ['function', 'type', 'struct'],
    correctAnswer: 'class'
  },
  {
    question: 'Which of the following is NOT a C# primitive data type?',
    wrongAnswers: ['int', 'float', 'char', 'string'],
    correctAnswer: 'double'
  },
  {
    question: 'What does the "using" keyword do in C#?',
    wrongAnswers: ['Imports a namespace', 'Defines a variable', 'Creates a loop', 'Declares a function'],
    correctAnswer: 'Manages resources and implements IDisposable'
  },
  {
    question: 'Which C# operator is used to access a member of an object?',
    wrongAnswers: ['-', '*', '=', '%'],
    correctAnswer: '.'
  },
  {
    question: 'What is the purpose of the "foreach" loop in C#?',
    wrongAnswers: [
      'To repeat a set of instructions',
      'To check a condition',
      'To define a function',
      'To assign a value to a variable'
    ],
    correctAnswer: 'To iterate over elements in a collection'
  },
  {
    question: 'Which attribute is used to specify the entry point of a C# program?',
    wrongAnswers: ['[Main]', '[EntryPoint]', '[Start]', '[Begin]'],
    correctAnswer: '[STAThread]'
  },
  {
    question: 'What is the keyword used to create an instance of a class in C#?',
    wrongAnswers: ['this', 'instance', 'create'],
    correctAnswer: 'new'
  },
  {
    question: 'Which exception is thrown when a null reference is encountered in C#?',
    wrongAnswers: ['DivideByZeroException', 'FileNotFoundException', 'FormatException', 'IndexOutOfRangeException'],
    correctAnswer: 'NullReferenceException'
  },
  {
    question: 'Which C# feature allows a class to inherit from multiple base classes?',
    wrongAnswers: ['Polymorphism', 'Abstraction', 'Encapsulation', 'Multiple Inheritance'],
    correctAnswer: 'Interface'
  },
  {
    question: 'What is the purpose of the "async" and "await" keywords in C#?',
    wrongAnswers: [
      'To handle exceptions',
      'To define a delegate',
      'To create a thread',
      'To access a database'
    ],
    correctAnswer: 'To enable asynchronous programming'
  },
  {
    question: 'Which attribute is used to mark a method as obsolete in C#?',
    wrongAnswers: ['[Deprecated]', '[Removed]', '[NotUsed]'],
    correctAnswer: '[Obsolete]'
  },
  {
    question: 'Which feature was introduced in C# 9.0 that allows for pattern matching in switch statements?',
    wrongAnswers: ['Tuples', 'Records', 'Deconstruction', 'Switch expressions'],
    correctAnswer: 'Pattern matching'
  },
  {
    question: 'What is the purpose of the StringBuilder class in C#?',
    wrongAnswers: [
      'To manipulate files',
      'To perform mathematical calculations',
      'To create graphical user interfaces',
      'To generate random numbers'
    ],
    correctAnswer: 'To efficiently manipulate strings'
  },
  {
    question: 'What is the purpose of the "finally" block in a try-catch-finally statement in C#?',
    wrongAnswers: [
      'To define a variable',
      'To handle exceptions',
      'To create an object',
      'To initialize an array'
    ],
    correctAnswer: 'To ensure code execution regardless of exceptions'
  },
  {
    question: 'Which C# feature allows you to define a method with the same name but different parameters?',
    wrongAnswers: ['Overloading', 'Inheritance', 'Polymorphism', 'Abstraction'],
    correctAnswer: 'Method overloading'
  },
  {
    question: 'What is the purpose of the "sealed" keyword in C#?',
    wrongAnswers: ['To prevent memory leaks', 'To optimize performance', 'To define a constant'],
    correctAnswer: 'To restrict inheritance'
  },
  {
    question: 'Which C# operator is used to perform explicit type conversion?',
    wrongAnswers: ['as', 'is', 'typeof', 'convert'],
    correctAnswer: 'cast'
  },
  {
    question: 'What does the "ref" keyword do in C#?',
    wrongAnswers: ['Declares a variable', 'Assigns a value', 'Defines a loop', 'Calls a method'],
    correctAnswer: 'Passes a variable by reference'
  },
  {
    question: 'Which collection type in C# ensures uniqueness of its elements?',
    wrongAnswers: ['List', 'Array', 'Dictionary', 'Stack'],
    correctAnswer: 'Set'
  },
  {
    question: 'What is the purpose of the "lock" statement in C#?',
    wrongAnswers: ['To define a class', 'To declare a variable', 'To perform arithmetic operations'],
    correctAnswer: 'To synchronize access to a resource'
  },
  {
    question: 'What is the difference between the "readonly" and "const" keywords in C#?',
    wrongAnswers: [
      'There is no difference, they can be used interchangeably',
      'readonly is used for value types, const is used for reference types',
      'readonly can only be used in classes, const can be used in structs',
      'const can be assigned a value at runtime, readonly can only be assigned at compile-time'
    ],
    correctAnswer: 'readonly can be assigned a value at runtime, const can only be assigned at compile-time'
  },
  {
    question: 'Which C# keyword is used to prevent a class from being inherited?',
    wrongAnswers: ['final', 'static', 'const'],
    correctAnswer: 'sealed'
  },
  {
    question: 'What is the purpose of the "yield" keyword in C#?',
    wrongAnswers: [
      'To exit a loop',
      'To break out of a switch statement',
      'To throw an exception'
    ],
    correctAnswer: 'To generate a sequence of values lazily'
  },
  {
    question: 'What does the "using" directive do in C#?',
    wrongAnswers: ['Defines a class', 'Creates an object', 'Calls a method'],
    correctAnswer: 'Imports a namespace'
  },
  {
    question: 'Which C# operator is used for null conditional access?',
    wrongAnswers: ['*', '#', '.'],
    correctAnswer: '?.'
  },
  {
    question: 'What is the purpose of the "out" keyword in C#?',
    wrongAnswers: ['Declares a constant', 'Defines a method', 'Assigns a value'],
    correctAnswer: 'Returns multiple values'
  },
  {
    question: 'Which C# attribute is used to control the serialization process?',
    wrongAnswers: ['[Serializable]', '[XmlIgnore]', '[JsonIgnore]'],
    correctAnswer: '[DataContract]'
  },
  {
    question: 'What is the purpose of the "nameof" operator in C#?',
    wrongAnswers: [
      'To retrieve the current date and time',
      'To concatenate strings',
      'To convert data types',
      'To calculate mathematical expressions'
    ],
    correctAnswer: 'To obtain the name of a variable, type, or member'
  },
  {
    question: 'Which C# feature is used to create lightweight thread-like units of work?',
    wrongAnswers: ['Threads', 'Tasks', 'Processes', 'Events'],
    correctAnswer: 'Async/await'
  },
  {
    question: 'What is the purpose of the "params" keyword in C#?',
    wrongAnswers: ['To define a variable', 'To access an array', 'To handle exceptions', 'To create a delegate'],
    correctAnswer: 'To accept a variable number of arguments'
  },
  {
    question: 'Which C# operator is used for null-coalescing?',
    wrongAnswers: ['+', '||', '*', '&'],
    correctAnswer: '??'
  },
  {
    question: 'What does the "yield return" statement do in C#?',
    wrongAnswers: [
      'Exits the current loop iteration',
      'Raises an exception',
      'Breaks out of a switch statement'
    ],
    correctAnswer: 'Returns a value and suspends the iterator function'
  },
  {
    question: 'Which C# attribute is used to specify the maximum length of a string property?',
    wrongAnswers: ['[Size]', '[Limit]', '[Range]'],
    correctAnswer: '[MaxLength]'
  },
  {
    question: 'What is the purpose of the "this" keyword in C#?',
    wrongAnswers: ['To define a class', 'To assign a value', 'To create an object'],
    correctAnswer: 'To refer to the current instance of a class'
  },
  {
    question: 'Which C# feature allows you to group related classes, structs, and interfaces?',
    wrongAnswers: ['Inheritance', 'Polymorphism', 'Encapsulation'],
    correctAnswer: 'Namespaces'
  },
  {
    question: 'What is the purpose of the "using" statement in C#?',
    wrongAnswers: ['To define a loop', 'To instantiate a class', 'To access a file', 'To format a string'],
    correctAnswer: 'To automatically dispose of resources'
  },
  {
    question: 'Which C# keyword is used to create an abstract class?',
    wrongAnswers: ['interface', 'struct', 'sealed', 'virtual'],
    correctAnswer: 'abstract'
  },
  {
    question: 'What is the purpose of the "async" keyword in C#?',
    wrongAnswers: ['To handle exceptions', 'To define a delegate', 'To create a thread', 'To access a database'],
    correctAnswer: 'To enable asynchronous programming'
  },
  {
    question: 'Which attribute is used to specify the display format of a DateTime property in C#?',
    wrongAnswers: ['[DateTimeFormat]', '[Format]', '[DateTimeDisplay]'],
    correctAnswer: '[DisplayFormat]'
  },
  {
    question: 'What is the purpose of the "unchecked" keyword in C#?',
    wrongAnswers: ['To handle exceptions', 'To perform arithmetic operations', 'To create an unchecked block'],
    correctAnswer: 'To suppress overflow checks'
  },
  {
    question: 'Which C# feature allows you to define a class within another class?',
    wrongAnswers: ['Inheritance', 'Composition', 'Polymorphism'],
    correctAnswer: 'Nested classes'
  },
  {
    question: 'What is the purpose of the "yield break" statement in C#?',
    wrongAnswers: [
      'Exits the current loop iteration',
      'Raises an exception',
      'Breaks out of a switch statement',
      'Returns a value and terminates the iterator function'
    ],
    correctAnswer: 'Terminates the iterator function without returning a value'
  },
  {
    question: 'What is the purpose of the "async" modifier in C#?',
    wrongAnswers: [
      'To define a constant',
      'To handle exceptions',
      'To create an object',
      'To declare a method'
    ],
    correctAnswer: 'To indicate an asynchronous method'
  },
  {
    question: 'Which C# attribute is used to specify the default value of a method parameter?',
    wrongAnswers: [
      '[DefaultValue]',
      '[Optional]',
      '[Default]',
      '[Value]'
    ],
    correctAnswer: '[DefaultParameterValue]'
  },
  {
    question: 'What does the "nameof" operator return for a property in C#?',
    wrongAnswers: [
      'The property value',
      'The property type',
      'The property setter',
      'The property getter'
    ],
    correctAnswer: 'The property name'
  },
  {
    question: 'Which C# feature allows you to define properties with get and set accessors?',
    wrongAnswers: [
      'Constructors',
      'Fields',
      'Events',
      'Methods'
    ],
    correctAnswer: 'Properties'
  },
  {
    question: 'What is the purpose of the "lock" statement in C#?',
    wrongAnswers: [
      'To define a class',
      'To declare a variable',
      'To perform arithmetic operations'
    ],
    correctAnswer: 'To synchronize access to a resource'
  },
  {
    question: 'Which C# attribute is used to enforce type safety at compile-time?',
    wrongAnswers: [
      '[Obsolete]',
      '[Serializable]',
      '[DebuggerDisplay]',
      '[TypeSafe]'
    ],
    correctAnswer: '[TypeSafeAttribute]'
  },
  {
    question: 'What is the purpose of the "using" directive in C#?',
    wrongAnswers: [
      'To create an object',
      'To define a class',
      'To access a file',
      'To format a string'
    ],
    correctAnswer: 'To import namespaces'
  },
  {
    question: 'Which C# feature is used to create a shorthand method implementation?',
    wrongAnswers: [
      'Delegates',
      'Interfaces',
      'Lambdas',
      'Events'
    ],
    correctAnswer: 'Expression-bodied methods'
  },
  {
    question: 'What is the purpose of the "base" keyword in C#?',
    wrongAnswers: [
      'To access a derived class',
      'To define a base class',
      'To call a static method',
      'To create an object'
    ],
    correctAnswer: 'To access the base class members'
  },
  {
    question: 'Which C# attribute is used to specify the serialization order of class members?',
    wrongAnswers: [
      '[DataMember]',
      '[XmlIgnore]',
      '[JsonProperty]'
    ],
    correctAnswer: '[ProtoMember]'
  }
];

Object.freeze(examInDatabase);

// TODO: move helper functions to utility file
// helper functions
function shuffleArray(
  array: string[] | GeneratedExamQuestion[]
): string[] | GeneratedExamQuestion[] {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }

  return array;
}

function formatSecondsToTime(s: number) {
  const hourInSeconds = 60 * 60;
  const minuteInSeconds = 60;
  const h = Math.floor(s / hourInSeconds);
  s -= h * hourInSeconds;

  const minutes = Math.floor(s / minuteInSeconds);
  s -= minutes * minuteInSeconds;

  const mm = minutes < 10 && h >= 1 ? `0${minutes}` : minutes;
  const seconds = s % 60;
  const ss = seconds < 10 ? `0${seconds}` : seconds;

  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

// TODO: generate exam on server
function generateExam(): GeneratedExamQuestion[] {
  const NUMBER_OF_ANSWERS_PER_QUESTION = 4;
  const NUMBER_OF_QUESTIONS_IN_EXAM = 50;
  const generatedExam: GeneratedExamQuestion[] = [];
  const examFromDatabase = Array.from(examInDatabase);

  while (generatedExam.length < NUMBER_OF_QUESTIONS_IN_EXAM) {
    const randomIndex = Math.floor(
      Math.random() * (examFromDatabase.length - 1)
    );
    const randomQuestion = examFromDatabase.splice(randomIndex, 1)[0];
    const wrongAnswers = randomQuestion.wrongAnswers;
    const answers = [randomQuestion.correctAnswer];

    while (answers.length < NUMBER_OF_ANSWERS_PER_QUESTION) {
      const index = Math.floor(Math.random() * (wrongAnswers.length - 1));
      const randomAnswer = wrongAnswers.splice(index, 1)[0];
      answers.push(randomAnswer);
    }

    const newExamQuestion: GeneratedExamQuestion = {
      question: randomQuestion.question,
      answers: shuffleArray(answers) as string[]
    };

    generatedExam.push(newExamQuestion);
  }

  return shuffleArray(generatedExam) as GeneratedExamQuestion[];
}

/* const exampleGeneratedExam = [
  {
    "question": "What is the extension for a JavaScript file?",
    "answers": ['.txt', '.js', '.html', '.css']
  },
  ...rest_of_questions
]*/

/* const exampleUserExam = [
  {
    "question": "What is the extension for a JavaScript file?",
    "answer": ".doc"
  },
  ...rest_of_questions
]*/

/* const exampleExamResults = [
    {
      "question": "What is the extension for a JavaScript file?",
      "answer": ".doc",
      "correct": false
    }
    ...rest_of_questions
  ]
 */

/* example item added to completedChalleges array
  {
    "id": "645147516c245de4d11eb7ba",
    "completedDate": 1644532946064,
    "exam": {
      "completionTimeInSeconds": number,
      "results": [
        {
          "question": "What is the extension for a JavaScript file?",
          "answer": ".doc",
          "correct": false
        },
        ...rest_of_questions
      ]
    }
  }*/

const generatedExam = generateExam();
Object.freeze(generatedExam);

class ShowExam extends Component<ShowExamProps, ShowExamState> {
  static displayName: string;
  private _container: RefObject<HTMLElement> | undefined;
  timerInterval!: NodeJS.Timeout;

  constructor(props: ShowExamProps) {
    super(props);
    this.state = {
      currentQuestionIndex: 0,
      generatedExam: generatedExam,
      examTimeInSeconds: 200,
      userExam: [],
      showResults: false
    };

    this.runExam = this.runExam.bind(this);
    this.goToPreviousQuestion = this.goToPreviousQuestion.bind(this);
    this.goToNextQuestion = this.goToNextQuestion.bind(this);
    this.selectAnswer = this.selectAnswer.bind(this);
    this.finishExam = this.finishExam.bind(this);
    this.createExamResults = this.createExamResults.bind(this);
    this.submitExamResults = this.submitExamResults.bind(this);
  }

  componentDidMount(): void {
    const {
      challengeMounted,
      data: {
        challengeNode: {
          challenge: { challengeType, helpCategory, title }
        }
      },
      pageContext: { challengeMeta },
      updateChallengeMeta
    } = this.props;
    updateChallengeMeta({
      ...challengeMeta,
      title,
      challengeType,
      helpCategory
    });
    challengeMounted(challengeMeta.id);

    this._container?.current?.focus();
  }

  componentWillUnmount() {
    this.props.stopExam();
    clearInterval(this.timerInterval);
    window.removeEventListener('beforeunload', this.stopWindowClose);
    window.removeEventListener('unload', this.stopWindowClose);
    window.removeEventListener('popstate', this.stopBrowserBack);
  }

  stopWindowClose = (event: Event) => {
    event.preventDefault();
    alert('stop!');
  };

  stopBrowserBack = (event: Event) => {
    event.preventDefault();
    window.history.forward();
    alert('stop!');
  };

  runExam = () => {
    // TODO: show loader
    // TODO: fetch exam from server/database
    const newExam = this.state.generatedExam.map(q => {
      return { question: q.question, answer: null };
    });

    this.timerInterval = setInterval(() => {
      this.setState({
        examTimeInSeconds: this.state.examTimeInSeconds + 1
      });
    }, 1000);

    this.setState(
      {
        userExam: newExam
      },
      this.props.startExam
    );

    window.addEventListener('beforeunload', this.stopWindowClose);
    window.addEventListener('unload', this.stopWindowClose);
    window.addEventListener('popstate', this.stopBrowserBack);
  };

  selectAnswer = (index: number, option: string): void => {
    const newExam = Array.from(this.state.userExam);
    newExam[index].answer = option;
    this.setState({
      userExam: newExam
    });
  };

  goToPreviousQuestion = () => {
    this.setState({
      currentQuestionIndex: this.state.currentQuestionIndex - 1
    });
  };

  goToNextQuestion = () => {
    this.setState({
      currentQuestionIndex: this.state.currentQuestionIndex + 1
    });
  };

  // TODO: have server check the exam
  createExamResults = () => {
    // TODO: show loader
    const { setExamResults } = this.props;
    const { userExam, examTimeInSeconds } = this.state;

    const results: ExamResultQuestion[] = [];

    userExam.forEach(userQuestion => {
      const questionInDb = examInDatabase.find(
        dbQuestion => userQuestion.question === dbQuestion.question
      );

      const questionResult = {
        question: userQuestion.question,
        answer: userQuestion.answer,
        correct: questionInDb?.correctAnswer === userQuestion.answer
      };

      results.push(questionResult as ExamResultQuestion);
    });

    const examResults = {
      timeInSeconds: examTimeInSeconds,
      results
    };

    setExamResults(examResults);
  };

  finishExam = () => {
    clearInterval(this.timerInterval);
    this.props.closeFinishExamModal();
    this.createExamResults();
    this.setState({
      showResults: true
    });
  };

  submitExamResults = () => {
    window.removeEventListener('beforeunload', this.stopWindowClose);
    window.removeEventListener('unload', this.stopWindowClose);
    window.removeEventListener('popstate', this.stopBrowserBack);
    this.props.submitChallenge();
    this.props.stopExam();
  };

  render() {
    const {
      data: {
        challengeNode: {
          challenge: {
            block,
            description,
            fields: { blockName },
            instructions,
            superBlock,
            title,
            translationPending
          }
        }
      },
      examInProgress,
      isChallengeCompleted,
      openFinishExamModal,
      pageContext: {
        challengeMeta: { nextChallengePath, prevChallengePath }
      },
      t
    } = this.props;

    const {
      examTimeInSeconds,
      currentQuestionIndex,
      generatedExam,
      userExam,
      showResults
    } = this.state;

    const blockNameTitle = `${t(
      `intro:${superBlock}.blocks.${block}.title`
    )}: ${title}`;
    const windowTitle = `${blockNameTitle} | freeCodeCamp.org`;
    const ariaLabel = t('aria.answer');

    console.log(this.state);

    return examInProgress ? (
      <Grid>
        <Row>
          <Spacer size='medium' />
          <Col md={10} mdOffset={1} sm={10} smOffset={1} xs={12}>
            {showResults ? (
              <ExamResults
                title={title}
                submitExamResults={this.submitExamResults}
              />
            ) : (
              <div className='exam-wrapper'>
                <div className='exam-header'>
                  <div>Foundational C# with Microsoft Certification Exam</div>
                  <span>|</span>
                  <div> Time: {formatSecondsToTime(examTimeInSeconds)}</div>
                  <span>|</span>
                  <div>
                    Question {currentQuestionIndex + 1} of{' '}
                    {generatedExam.length}
                  </div>
                </div>
                <hr />
                <Spacer size='medium' />

                <div className='exam-questions'>
                  <div>{generatedExam[currentQuestionIndex].question}</div>
                  <Spacer size='large' />
                  <div className='exam-answers'>
                    {generatedExam[currentQuestionIndex].answers.map(
                      (option, answerIndex) => (
                        <label className='exam-answer-label' key={answerIndex}>
                          <input
                            aria-label={ariaLabel}
                            checked={
                              userExam[currentQuestionIndex].answer === option
                            }
                            className='exam-answer-input-hidden'
                            name='exam'
                            onChange={() =>
                              this.selectAnswer(currentQuestionIndex, option)
                            }
                            type='radio'
                            value={option}
                          />{' '}
                          <span className='exam-answer-input-visible'>
                            {userExam[currentQuestionIndex].answer ===
                            option ? (
                              <span className='exam-answer-input-selected' />
                            ) : null}
                          </span>
                          <PrismFormatted
                            className={'exam-answer'}
                            text={option}
                          />
                        </label>
                      )
                    )}
                  </div>
                </div>
                <Spacer size='large' />

                <div className='exam-buttons'>
                  <Button
                    block={true}
                    className='exam-button'
                    disabled={currentQuestionIndex <= 0}
                    bsStyle='primary'
                    data-cy='previous-exam-question'
                    onClick={this.goToPreviousQuestion}
                  >
                    {t('buttons.previous-question')}
                  </Button>

                  {currentQuestionIndex === generatedExam.length - 1 ? (
                    <Button
                      block={true}
                      disabled={!userExam[currentQuestionIndex].answer}
                      className='exam-button'
                      bsStyle='primary'
                      data-cy='finish-exam'
                      onClick={openFinishExamModal}
                    >
                      {t('buttons.finish-exam')}
                    </Button>
                  ) : (
                    <Button
                      block={true}
                      disabled={!userExam[currentQuestionIndex].answer}
                      className='exam-button'
                      bsStyle='primary'
                      data-cy='next-exam-question'
                      onClick={this.goToNextQuestion}
                    >
                      {t('buttons.next-question')}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Col>
          <FinishExamModal finishExam={this.finishExam} />
        </Row>
      </Grid>
    ) : (
      <Hotkeys
        innerRef={this._container}
        nextChallengePath={nextChallengePath}
        prevChallengePath={prevChallengePath}
      >
        <LearnLayout>
          <Helmet title={windowTitle} />
          <Grid>
            <Row>
              <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
                <ChallengeTitle
                  isCompleted={isChallengeCompleted}
                  translationPending={translationPending}
                >
                  {title}
                </ChallengeTitle>
                <Spacer size='medium' />
                <PrismFormatted text={description} />
                <Spacer size='medium' />
                <PrismFormatted text={instructions} />

                <Button
                  block={true}
                  bsStyle='primary'
                  data-cy='start-exam'
                  onClick={this.runExam}
                >
                  {t('buttons.click-start-exam')}
                </Button>
              </Col>
              <CompletionModal />
              <HelpModal challengeTitle={title} challengeBlock={blockName} />
            </Row>
          </Grid>
        </LearnLayout>
      </Hotkeys>
    );
  }
}

ShowExam.displayName = 'ShowExam';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ShowExam));

// GraphQL
export const query = graphql`
  query ExamChallenge($slug: String!) {
    challengeNode(challenge: { fields: { slug: { eq: $slug } } }) {
      challenge {
        challengeType
        description
        fields {
          blockName
        }
        helpCategory
        id
        instructions
        superBlock
        title
        translationPending
      }
    }
  }
`;
