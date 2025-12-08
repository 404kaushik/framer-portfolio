import { motion } from "framer-motion";
import { Grid3x3, Asterisk, Layers } from 'lucide-react';

const projects = [
  {
    name: "Shelf",
    description: "Digital Library for Developers",
    icon: <Grid3x3 size={24} color="#FFFFFF" />,
  },
  {
    name: "Locale",
    description: "Lightweight Content Localization",
    icon: <Asterisk size={24} color="#E59A84" />,
  },
  {
    name: "Taskly",
    description: "Minimal Task Manager",
    icon: <Layers size={24} color="#6A84E5" />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Projects = () => {
  return (
    <div className="bg-[#111111] min-h-screen flex items-center justify-center font-['Inter'] relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 18, 18, 0) 1px, #2a2a2a 1px), linear-gradient(90deg, rgba(18, 18, 18, 0) 1px, #2a2a2a 1px)',
          backgroundSize: '3rem 3rem',
          backgroundPosition: 'center center',
        }}
      />
      <div className="w-full max-w-3xl mx-auto px-8 z-10">
        <motion.h1 
          className="text-7xl font-bold text-white mb-24 tracking-tighter"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Projects
        </motion.h1>
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project) => (
            <motion.div
              key={project.name}
              className="bg-[#1C1C1C]/60 backdrop-blur-sm border border-white/10 rounded-3xl p-6 flex items-center space-x-6 shadow-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            >
              <div className="w-16 h-16 bg-[#2A2A2A] rounded-2xl flex items-center justify-center shadow-inner-lg">
                {project.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{project.name}</h2>
                <p className="text-lg text-gray-400 tracking-tight">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;