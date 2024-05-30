/* eslint-disable @next/next/no-img-element */
import { motion, AnimatePresence } from "framer-motion";

import ContactBtn from "../UI Component/ContactBtn";
import CoffeBtn from "../UI Component/CoffeBtn";
// import GithubBtn from "../UI Component/GithubBtn";
import SetEmpty from "../UI Component/SetEmpty";
import SetSample from "../UI Component/SetSample";
import TemplateSwitcher from "../UI Component/TemplateSwitcher";

const SettingMain = () => {
  return (
    <AnimatePresence>
      <motion.div layout className='cardStyle'>
        <img src='/fav.png' alt='Description of the image' />
        <h1 className='text-2xl font-bold'>CVify.me</h1>
        <div className='mt-5'>
          <p>
            <b>Job applications feeling overwhelming?</b> Our user-friendly CV
            builder is here to help! We offer a wide range of professional
            templates, making it easy to create a compelling CV that showcases
            your unique talents and grabs the attention of recruiters. Let's get
            you started on your career journey today!
          </p>
        </div>
        <div className='flex flex-col mt-4'>
          <div className='flex space-x-2 '>
            <SetEmpty />
            <SetSample />
          </div>
          <motion.div
            layout
            className='w-44 h-1 mx-auto mt-2 bg-gray-200 rounded-full'
          />
          <div className='flex space-x-2 mt-2'>
            <ContactBtn />

            {/* <GithubBtn /> */}
          </div>
          <div className='mt-2'>
            <CoffeBtn />
          </div>

          <div className='mt-5'>
            <h1 className='text-xl font-bold'>Templates</h1>
            <div className='flex flex-row space-x-4 mt-2'>
              <TemplateSwitcher value={1} />
              <TemplateSwitcher value={2} />
              <TemplateSwitcher value={3} />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingMain;
