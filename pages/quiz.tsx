import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { QUIZ_API_ENDPOINT } from '../constants';
import { pushAnswer, QuizContext, setQuestions } from '../contexts/quiz';
import FullSizeAppLayout from '../components/Layouts/FullSizeApp';
import QuestionCard from '../components/QuestionCard';
import QuizTimer from '../components/QuizTimer';

const Quiz = ({ questions }) => {
  const Router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [state, dispatch] = useContext(QuizContext);

  const currentQuestion = questions[currentQuestionIndex];

  const nextQuestion = (answer) => {
    dispatch(pushAnswer(answer));
    if (currentQuestionIndex !== questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      dispatch(setQuestions(questions));
      Router.push('/results');
    }
  };

  return (
    <FullSizeAppLayout title="Quiz">
      <div className="w-full h-screen px-10">
        <div className="h-full flex flex-col">
          <div className="py-6">
            <QuizTimer key={`timer-${currentQuestionIndex}`} onFinish={() => nextQuestion('')} />
          </div>
          <div className="py-14">
            {currentQuestion && (
              <QuestionCard
                key={`question-${currentQuestionIndex}`}
                category={currentQuestion.category}
                question={currentQuestion.question}
                questionIndicator={`${currentQuestionIndex + 1} / ${questions.length}`}
                onSelectAnswer={(answer) => setTimeout(() => nextQuestion(answer), 200)}
              />
            )}
          </div>
        </div>
      </div>
    </FullSizeAppLayout>
  );
};

export async function getServerSideProps() {
  const {
    data: { results: questions },
  } = await axios.get(QUIZ_API_ENDPOINT);

  return {
    props: {
      questions,
    },
  };
}

export default Quiz;
