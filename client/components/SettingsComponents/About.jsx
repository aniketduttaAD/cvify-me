import { BiImageAdd } from "react-icons/bi";
import { HiChevronRight } from "react-icons/hi";
import { BsPatchCheck } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import { CvContext } from "../../hooks/CvContext";
import Inputs from "../UI Component/Inputs";
import TextArea from "../UI Component/Textarea";
import CheckBox from "../UI Component/Checkbox";
import axios from "axios";

const About = () => {
  const { cv, uploadImage, updateCv } = useContext(CvContext);
  const [isOpen, setIsOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedTexts, setGeneratedTexts] = useState([]);
  const [error, setError] = useState(null);

  const generateAbout = async () => {
    setGenerating(true);
    setError(null);
    try {
      const requests = Array.from({ length: 3 }).map(() =>
        axios.post("http://localhost:8000/generate-about", {
          skills: cv.toolsAndTechSkills,
          jobTitle: cv.jobTitle,
        })
      );
      const responses = await Promise.all(requests);
      const texts = responses.map((response) => response.data).flat();
      setGeneratedTexts(texts.slice(0, 3)); // Ensure only 3 responses are set
    } catch (error) {
      console.error("Error generating about section:", error);
      setError("Failed to generate text");
    }
    setGenerating(false);
  };

  const selectGeneratedText = (text) => {
    updateCv("about", text);
    setGeneratedTexts([]);
  };

  return (
    <AnimatePresence initial={false}>
      <motion.div
        layout
        className='cardStyle'
        animate={{ marginBottom: isOpen ? "30px" : "20px" }}
      >
        <motion.div
          initial={false}
          onClick={() => setIsOpen(!isOpen)}
          layout
          className='w-full flex text-neutral-500 cursor-pointer text-lg'
        >
          <span className='flex-1'>About Yourself</span>
          <motion.div
            className='inline-block items-end'
            animate={{ rotate: isOpen ? 90 : 0 }}
          >
            <HiChevronRight className='inline w-6 h-6' />
          </motion.div>
        </motion.div>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key='content'
              initial='collapsed'
              animate='open'
              exit='collapsed'
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <CheckBox
                title='Display Image'
                value={cv.displayImage}
                keyChange='displayImage'
              />

              {cv.displayImage && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <label
                    htmlFor='dropzone'
                    className='flex mt-1 flex-col justify-center items-center w-full py-8 bg-white border-2 border-gray-300 border-dashed cursor-pointer rounded-xl'
                  >
                    <div className='flex flex-col items-center'>
                      {cv.image ? (
                        <BsPatchCheck className='h-10 w-10 text-emerald-600' />
                      ) : (
                        <BiImageAdd className='h-10 w-10 text-rose-500' />
                      )}
                      <p className='text-gray-500 mt-3'>
                        Click to upload your image
                      </p>
                      <p className='text-sm text-gray-400'>( *.jpg, *.png )</p>
                    </div>
                    <input
                      id='dropzone'
                      type='file'
                      accept='image/jpeg, image/png'
                      className='hidden'
                      onChange={uploadImage}
                    />
                  </label>
                </motion.div>
              )}

              <Inputs
                title='Name & Surname'
                value={cv.name}
                placeholder='Your name'
                keyChange='name'
              />
              <Inputs
                title='Job'
                value={cv.jobTitle}
                placeholder='What is your job?'
                keyChange='jobTitle'
              />
              <Inputs
                title='Location'
                value={cv.location}
                placeholder='Where do you live?'
                keyChange='location'
              />

              <div className='mt-4 flex justify-center'>
                <button
                  className='btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300'
                  onClick={generateAbout}
                  disabled={generating}
                >
                  {generating ? "Generating..." : "Generate About Using AI"}
                </button>
              </div>

              {error && (
                <p className='error-message text-red-500 mt-2'>{error}</p>
              )}

              {generatedTexts.length > 0 && (
                <div className='generated-texts mt-4'>
                  {generatedTexts.map((text, index) => (
                    <div key={index} className='card mt-2 p-2 border rounded'>
                      <p>{text}</p>
                      <button
                        className='btn btn-secondary mt-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-300'
                        onClick={() => selectGeneratedText(text)}
                      >
                        Use this text
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {generatedTexts.length === 0 && (
                <TextArea
                  title='About'
                  value={cv.about}
                  placeholder='A few sentences about yourself'
                  keyChange='about'
                />
              )}

              <motion.p
                layout
                className='projectAndExperienceTitle mt-5 text-lg'
              >
                Social
              </motion.p>
              <motion.div layout className='flex flex-wrap'>
                <CheckBox
                  title='Mail'
                  value={cv.displayMail}
                  keyChange='displayMail'
                />
                <CheckBox
                  title='Portfolio'
                  value={cv.displayWebSite}
                  keyChange='displayWebSite'
                />
                <CheckBox
                  title='Github'
                  value={cv.displayGithub}
                  keyChange='displayGithub'
                />
                <CheckBox
                  title='Twitter'
                  value={cv.displayTwitter}
                  keyChange='displayTwitter'
                />
                <CheckBox
                  title='LinkedIn'
                  value={cv.displayLinkedIn}
                  keyChange='displayLinkedIn'
                />
                <CheckBox
                  title='Instagram'
                  value={cv.displayInstagram}
                  keyChange='displayInstagram'
                />
                <CheckBox
                  title='Facebook'
                  value={cv.displayFacebook}
                  keyChange='displayFacebook'
                />
              </motion.div>
              {cv.displayMail && (
                <Inputs
                  title='Mail'
                  value={cv.email}
                  placeholder='example@mail.com'
                  keyChange='email'
                />
              )}

              {cv.displayWebSite && (
                <Inputs
                  title='Portfolio'
                  value={cv.website}
                  placeholder='Your website'
                  keyChange='website'
                />
              )}

              {cv.displayGithub && (
                <Inputs
                  title='Github'
                  value={cv.github}
                  placeholder='Your Github profile'
                  keyChange='github'
                />
              )}
              {cv.displayTwitter && (
                <Inputs
                  title='Twitter'
                  value={cv.twitter}
                  placeholder='Your Twitter profile'
                  keyChange='twitter'
                />
              )}
              {cv.displayLinkedIn && (
                <Inputs
                  title='LinkedIn'
                  value={cv.linkedIn}
                  placeholder='Your LinkedIn profile'
                  keyChange='linkedIn'
                />
              )}
              {cv.displayInstagram && (
                <Inputs
                  title='Instagram'
                  value={cv.instagram}
                  placeholder='Your Instagram profile'
                  keyChange='instagram'
                />
              )}
              {cv.displayFacebook && (
                <Inputs
                  title='Facebook'
                  value={cv.facebook}
                  placeholder='Your Facebook profile'
                  keyChange='facebook'
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default About;
