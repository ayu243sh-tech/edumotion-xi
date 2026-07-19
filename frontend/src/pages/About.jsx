import { ArrowLeft, GraduationCap, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-[#F8F5F2] py-12 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#7B1E1E] hover:underline mb-8"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-[#7B1E1E]">
            About Edumotion
          </h1>

          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Edumotion is an AI-powered learning platform created to make
            studying smarter, faster and more interactive for every student.
          </p>
        </div>

        {/* Founder Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8">

          <img
            src="/images/founder.jpg"
            alt="Founder"
            className="w-64 h-64 rounded-2xl object-cover shadow-lg"
          />

          <div>

            <h2 className="text-3xl font-bold text-[#7B1E1E]">
              Ayush Maurya
            </h2>

            <p className="text-lg text-[#F5B400] font-semibold mb-4">
              Founder & CEO
            </p>

            <p className="text-gray-700 leading-8">
              I founded Edumotion with one mission —
              to make quality education simple, engaging and accessible for
              every student.

              Edumotion combines AI, smart notes, quizzes, flashcards,
              previous year questions and beautiful PDFs into one platform,
              helping students understand concepts instead of just memorising
              them.
            </p>

          </div>

        </div>

        {/* Vision */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">

            <GraduationCap
              className="mx-auto text-[#7B1E1E]"
              size={40}
            />

            <h3 className="font-bold text-xl mt-4">
              Learn Better
            </h3>

            <p className="text-gray-600 mt-2">
              AI explanations designed especially for students.
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">

            <Sparkles
              className="mx-auto text-[#F5B400]"
              size={40}
            />

            <h3 className="font-bold text-xl mt-4">
              AI Powered
            </h3>

            <p className="text-gray-600 mt-2">
              Generate notes, quizzes, flashcards and summaries instantly.
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">

            <Target
              className="mx-auto text-[#7B1E1E]"
              size={40}
            />

            <h3 className="font-bold text-xl mt-4">
              Our Mission
            </h3>

            <p className="text-gray-600 mt-2">
              Empower millions of students with modern AI learning tools.
            </p>

          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-14">

          <h2 className="text-2xl font-bold text-[#7B1E1E]">
            Thank you for using Edumotion ❤️
          </h2>

          <p className="text-gray-600 mt-3">
            Together, let's make learning smarter.
          </p>

        </div>

      </div>
    </div>
  );
}
