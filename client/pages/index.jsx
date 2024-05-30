import Head from "next/head";
import CV from "../components/CV";
import Settings from "../components/Settings";
import PageButtons from "../components/PageButtons";
import { useState, useEffect, useRef } from "react";
import { CvContext } from "../hooks/CvContext";
import { cvData } from "../data/cvData";
import { useReactToPrint } from "react-to-print";
import CV2 from "../components/CV2";
import CV3 from "../components/CV3";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import LogoutButton from "./api/logout";
import { storage } from "../appwriteConfig"; 
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ID } from "appwrite";
import Link from "next/link";

export default function Home() {
  const [cv, setCv] = useState(cvData);
  const [orderId, setOrderId] = useState("");
  let cashfree;
  let initializeSDK = async function () {
    cashfree = await load({
      mode: "sandbox",
    });
  };

  initializeSDK();

  const [scale, setScale] = useState(1);
  const setCV = () => {
    setCv(cvData);
    localStorage.setItem("cv", JSON.stringify(cvData));
  };

  const setEmptyCv = () => {
    const emptyCv = {
      name: "",
      image: "",
      jobTitle: "",
      location: "",
      email: "",
      linkedin: "",
      twitter: "",
      github: "",
      website: "",
      about: "",
      toolsAndTechSkills: [],
      industryKnowledge: [],
      languages: [],
      skillTitle1: "",
      skillTitle2: "",
      skillTitle3: "",
      skills: [],
      projects: [
        {
          title: "",
          link: "",
          summary: "",
        },
      ],
      education: [
        {
          title: "",
          school: "",
          date: "",
        },
      ],
      experiences: [
        {
          title: "",
          company: "",
          startDate: "",
          endDate: "",
          summary: "",
        },
      ],
      displayImage: false,
      displayMail: false,
      displayWebSite: false,
      displayGithub: false,
      displayTwitter: false,
      activeColor: "#5B21B6",
    };
    setCv(emptyCv);
    localStorage.setItem("cv", JSON.stringify(emptyCv));
  };

  const [template, setTemplate] = useState(1);

  useEffect(() => {
    const savedTemplate = sessionStorage.getItem("selectedTemplate");
    if (savedTemplate) {
      setTemplate(parseInt(savedTemplate, 10));
    }
  }, []);

  const selectTemplate = (e) => {
    setTemplate(parseInt(e.target.value, 10));
  };

  const updateCv = (key, value) => {
    const newCv = { ...cv, [key]: value };
    setCv(newCv);
    localStorage.setItem("cv", JSON.stringify(newCv));
  };

  const addTag = (e, key, value) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newCv = { ...cv, [key]: [...cv[key], value] };
      const unique = newCv[key].filter((item, index) => {
        return newCv[key].indexOf(item) === index;
      });
      newCv[key] = unique;
      setCv(newCv);
      localStorage.setItem("cv", JSON.stringify(newCv));
      e.target.value = "";
    }

    if (e.key === "Backspace" && e.target.value === "") {
      const newCv = { ...cv, [key]: cv[key].slice(0, -1) };
      setCv(newCv);
      localStorage.setItem("cv", JSON.stringify(newCv));
    }
  };

  const removeTag = (key, value) => {
    const newCv = { ...cv, [key]: cv[key].filter((tag) => tag !== value) };
    setCv(newCv);
    localStorage.setItem("cv", JSON.stringify(newCv));
  };

  const addExperience = (experience) => {
    const newCv = { ...cv, experiences: [...cv.experiences, experience] };
    setCv(newCv);
    localStorage.setItem("cv", JSON.stringify(newCv));
  };

  const addProject = (project) => {
    const newCv = { ...cv, projects: [...cv.projects, project] };
    setCv(newCv);
    localStorage.setItem("cv", JSON.stringify(newCv));
  };

  const addEducation = (education) => {
    const newCv = { ...cv, education: [...cv.education, education] };
    setCv(newCv);
    localStorage.setItem("cv", JSON.stringify(newCv));
  };

  const uploadImage = (e) => {
    const allowedFiles = ["image/png", "image/jpg", "image/jpeg"];
    const file = e.target.files[0];
    if (!file) {
      throw new Error("FILE_NOT_SELECTED");
    }
    const reader = new FileReader();
    const isAllowed = allowedFiles.some((type) => file.type === type);
    if (!isAllowed) {
      throw new Error("UNSUPPORTED_FILE_TYPE");
    }
    reader.readAsDataURL(file);
    reader.onerror = (e) => {
      throw new Error("FILE_READ_ERROR", e);
    };
    reader.onload = (e) => {
      updateCv("image", e.target.result);
    };
  };

  const scaleUp = () => {
    if (scale < 1.6) {
      setScale(scale + 0.1);
    }
  };
  const scaleDown = () => {
    if (scale > 0.4) {
      setScale(scale - 0.1);
    }
  };

  useEffect(() => {
    const cvLocal = localStorage.getItem("cv");
    if (cvLocal) {
      setCv((currentCv) => ({ ...currentCv, ...JSON.parse(cvLocal) }));
    }
  }, []);

  const [userName, setUserName] = useState("User");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const user = await account.getPrefs();
  //       console.log(user);
  //       setUserName(user ? user.name : "User");
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle:
      "body { transform-origin: top left; margin: auto; transform: scale(1); -webkit-print-color-adjust: exact !important;  color-adjust: exact !important; print-color-adjust: exact !important; }",
    documentTitle: cv.name,
    onAfterPrint: () => console.log("printed"),
  });

const generateAndUploadPdf = async () => {
  const input = componentRef.current;
  if (!input) return;

  // Capture HTML content as an image
  const canvas = await html2canvas(input);
  const imgData = canvas.toDataURL("image/png");

  // Convert image to PDF
  const pdf = new jsPDF("p", "pt", "a4");
  const imgWidth = 595.28;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

  // Convert PDF to blob
  const pdfBlob = pdf.output("blob");

  // Create a File object from the PDF blob
  const pdfFile = new File([pdfBlob], "cv.pdf", { type: "application/pdf" });

  // Upload PDF file to storage
  const formData = new FormData();
  formData.append("file", pdfFile);

  try {
    const response = await storage.createFile(
      "665336a70035953512fd",
      ID.unique(),
      pdfFile,
    );

    console.log("File uploaded successfully", response);
    alert("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file", error);
    alert("Error uploading file");
  }
};

  const ifScaleUpOrDown = async () => {
    if (scale > 1 || scale < 1) {
      setScale(1);
    }

    const getSessionId = async () => {
      try {
        let response = await axios.get("http://localhost:8000/payment");
        if (response.data && response.data.payment_session_id) {
          console.log(response.data);
          setOrderId(response.data.order_id);
          return response.data.payment_session_id;
        }
      } catch (error) {
        console.log(error);
      }
    };

    const verifyPayment = async () => {
      try {
        let res = await axios.post("http://localhost:8000/verify", {
          orderId: orderId,
        });
        alert("Payment was done successfully!");
        if (res && res.data) {
          localStorage.setItem("downloadClick", "3");
        }
      } catch (error) {
        console.log(error);
        localStorage.setItem("downloadClick", "1");
      }
    };

    const handleRedirect = async () => {
      try {
        let sessionID = await getSessionId();
        let checkoutOptions = {
          paymentSessionId: sessionID,
          redirectTarget: "_modal",
        };
        cashfree.checkout(checkoutOptions).then((res) => {
          console.log("payment initiate");
          verifyPayment(orderId);
        });
      } catch (error) {
        console.error(error);
        localStorage.setItem("downloadClick", "1");
      }
    };

    const downloadCount = parseInt(localStorage.getItem("downloadClick")) || 0;
    const newCount = downloadCount + 1;
    localStorage.setItem("downloadClick", newCount.toString());

    if (newCount === 2) {
      handleRedirect();
      return;
    }

    await generateAndUploadPdf();
    handlePrint();
  };

  const templateSwitch = () => {
    switch (template) {
      case 1:
        return <CV2 />;
      case 2:
        return <CV3 />;
      case 3:
        return <CV />;
      default:
        return <CV2 />;
    }
  };

  const componentRef = useRef();

  return (
    <>
      <Head>
        <title>CVify.me</title>
        <meta
          name='CVify.me'
          content='Beautifully designed cv builder where you can see the changes at the same time'
        />
        <link rel='icon' href='/fav.png' />
      </Head>
      <CvContext.Provider
        value={{
          cv,
          uploadImage,
          updateCv,
          addProject,
          addExperience,
          addTag,
          removeTag,
          setEmptyCv,
          setCV,
          scaleUp,
          scaleDown,
          ifScaleUpOrDown,
          selectTemplate,
          addEducation,
        }}
      >
        <header className='flex items-center justify-between py-4 px-8 bg-gray-800 text-white'>
          <div className='flex items-center'>
            {/* User Avatar */}
            <div className='h-10 w-10 rounded-full bg-gray-500 flex items-center justify-center mr-2'>
              <span>{userName}</span>
            </div>
            {/* User Name */}
            <h1 className='text-xl font-semibold'>{userName}</h1>
          </div>
          {/* Toggle Menu */}
          <div className='flex items-center space-x-4'>
            {/* My Resumes */}
            <button className='text-sm font-medium hover:text-gray-300 focus:outline-none'>
              <Link href='/my-resumes'>My Resumes</Link>
            </button>
            {/* Logout */}
            <LogoutButton />
          </div>
        </header>
        <main className='flex m-auto md:w-auto w-fit flex-col-reverse justify-center items-center md:relative md:items-stretch  md:h-screen'>
          <div className='m-auto md:w-fit md:h-fit relative md:absolute  md:left-[26.5rem] md:right-0 md:bottom-0 md:flex md:top-0 '>
            <div>
              <section
                ref={componentRef}
                className='bg-white md:rounded-md transition-all p-8 h-[840px] w-[594px] md:w-[594px] md:h-[840px]'
                style={{
                  transform: `scale(${scale})`,
                }}
              >
                {templateSwitch()}
              </section>
            </div>
          </div>
          <PageButtons />
          <div className='flex align-middle h-full'>
            <section className='settings rounded-2xl w-full overflow-auto'>
              <Settings />
            </section>
            <div className='md:meshGradient left-0 bg-slate-300 h-full w-full md:opacity-20 fixed md:absolute -z-10  md:h-screen'></div>
          </div>
        </main>
      </CvContext.Provider>
    </>
  );
}
