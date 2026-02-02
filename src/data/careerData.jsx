import { Cpu, Layers, Code, Brain, Globe, Monitor, Terminal, Search, TrendingUp, Cloud, Shield, Users, Database, Wifi } from 'lucide-react';
import React from 'react';

export const careerData = [
    // AI
    {
        id: "iot-engineer",
        title: "IoT Engineer",
        categories: ["AI"],
        description: "An IoT engineer designs, develops, and manages Internet of Things (IoT) devices and systems to enable seamless connectivity and data exchange.",
        icon: <Cpu className="w-6 h-6" />,
        stats: {
            global: { listings: "32,000+", salary: "$110,000", projected: "145,000" },
            india: { listings: "12,000+", salary: "₹12,00,000", projected: "55,000" }
        },
        overview: "IoT Engineers are the architects of the connected world. They design and implement the systems that allow physical devices to collect and exchange data. From smart homes to industrial sensors, they ensure seamless communication between hardware and cloud platforms.",
        outlook: "+21% (Much faster than average)"
    },
    {
        id: "software-architect",
        title: "Software Architect",
        categories: ["AI"],
        description: "A software architect designs and oversees the technical standards, structure, and framework of software systems to ensure they meet business needs and technical requirements.",
        icon: <Layers className="w-6 h-6" />,
        stats: {
            global: { listings: "28,500+", salary: "$145,000", projected: "160,000" },
            india: { listings: "8,000+", salary: "₹25,00,000", projected: "40,000" }
        },
        overview: "Software Architects make high-level design choices and dictate technical standards, including software coding standards, tools, and platforms. They are the visionaries behind robust, scalable software systems.",
        outlook: "+18% (Much faster than average)"
    },
    {
        id: "software-developer",
        title: "Software Developer",
        categories: ["AI"],
        description: "A software developer designs, builds, and maintains software applications to meet user needs and solve business challenges.",
        icon: <Code className="w-6 h-6" />,
        stats: {
            global: { listings: "250,000+", salary: "$105,000", projected: "1.5M" },
            india: { listings: "80,000+", salary: "₹9,00,000", projected: "500,000" }
        },
        overview: "Software Developers are the creative minds behind computer programs. Some develop the applications that allow people to do specific tasks on a computer or another device. Others develop the underlying systems that run the devices or that control networks.",
        outlook: "+25% (Much faster than average)"
    },
    {
        id: "ai-engineer",
        title: "AI Engineer",
        categories: ["AI"],
        description: "An artificial intelligence (AI) engineer designs, develops and implements artificial intelligence models and algorithms to solve complex problems and improve business processes.",
        icon: <Brain className="w-6 h-6" />,
        stats: {
            global: { listings: "45,000+", salary: "$150,000", projected: "200,000" },
            india: { listings: "15,000+", salary: "₹18,00,000", projected: "60,000" }
        },
        overview: "AI Engineers build AI models using machine learning algorithms and deep learning neural networks to draw business insights, which can be used to make business decisions that affect the entire organization.",
        outlook: "+35% (Much faster than average)"
    },

    // Cloud
    {
        id: "network-engineer",
        title: "Network Engineer",
        categories: ["Cloud", "Network", "Tech Support"],
        description: "Network engineers are responsible for designing, planning, and implementing network infrastructures, including local area networks (LANs), wide area networks (WANs), and intranets.",
        icon: <Globe className="w-6 h-6" />,
        stats: {
            global: { listings: "60,000+", salary: "$95,000", projected: "350,000" },
            india: { listings: "25,000+", salary: "₹6,00,000", projected: "100,000" }
        },
        overview: "Network Engineers set up, administer, maintain and upgrade local and wide area networks for an organization. They are responsible for security, data storage and disaster recovery strategies.",
        outlook: "+5% (As fast as average)"
    },
    {
        id: "systems-engineer",
        title: "Systems Engineer",
        categories: ["Cloud", "Network"],
        description: "A systems engineer evaluates an organization’s IT systems and processes to identify inefficiencies and recommend solutions to improve performance.",
        icon: <Monitor className="w-6 h-6" />,
        stats: {
            global: { listings: "40,000+", salary: "$110,000", projected: "300,000" },
            india: { listings: "18,000+", salary: "₹8,00,000", projected: "80,000" }
        },
        overview: "Systems Engineers manage and monitor all installed systems and infrastructure. They install, configure, test and maintain operating systems, application software and system management tools.",
        outlook: "+10% (Faster than average)"
    },
    {
        id: "full-stack-developer",
        title: "Full Stack Developer",
        categories: ["Cloud"],
        description: "A full stack developer designs, develops, and maintains both the front-end (user interface) and back-end (server, database) components of web applications.",
        icon: <Code className="w-6 h-6" />,
        stats: {
            global: { listings: "85,000+", salary: "$115,000", projected: "400,000" },
            india: { listings: "40,000+", salary: "₹10,00,000", projected: "150,000" }
        },
        overview: "Full Stack Developers are comfortable working with both back-end and front-end technologies. " +
            "They are jacks-of-all-trades who can handle the work of databases, servers, systems engineering, and clients.",
        outlook: "+22% (Much faster than average)"
    },
    {
        id: "linux-administrator",
        title: "Linux Administrator",
        categories: ["Cloud", "Network"],
        description: "A Linux administrator is responsible for completing routine security audits and administrative scripting with computer languages such as Perl, Python and Shell.",
        icon: <Terminal className="w-6 h-6" />,
        stats: {
            global: { listings: "15,000+", salary: "$90,000", projected: "50,000" },
            india: { listings: "5,000+", salary: "₹7,00,000", projected: "20,000" }
        },
        overview: "Linux Administrators manage the operations of computer systems like installing, maintaining, and upgrading servers that run on the Linux operating system. They ensure the reliability and security of the IT infrastructure.",
        outlook: "+6% (As fast as average)"
    },
    {
        id: "systems-analyst",
        title: "Systems Analyst",
        categories: ["Cloud", "Network"],
        description: "A systems analyst works with physical computer networks, allowing them to be highly employable by many different organizations.",
        icon: <Search className="w-6 h-6" />,
        stats: {
            global: { listings: "50,000+", salary: "$93,000", projected: "600,000" },
            india: { listings: "20,000+", salary: "₹8,50,000", projected: "200,000" }
        },
        overview: "Systems Analysts interact with different stakeholders to understand business requirements and design information systems that help the organization operate more efficiently and effectively.",
        outlook: "+7% (As fast as average)"
    },
    {
        id: "it-project-manager",
        title: "IT Project Manager",
        categories: ["Cloud", "Data", "Tech Support"],
        description: "An IT project manager plans, organizes, and oversees technical projects for a company or its clients, ensuring they are completed on time, within budget, and meet desired objectives.",
        icon: <TrendingUp className="w-6 h-6" />,
        stats: {
            global: { listings: "120,000+", salary: "$130,000", projected: "800,000" },
            india: { listings: "45,000+", salary: "₹15,00,000", projected: "300,000" }
        },
        overview: "IT Project Managers are responsible for planning, executing, and closing projects. They are accountable for the entire project scope, project team, resources, and the success or failure of the project.",
        outlook: "+11% (Faster than average)"
    },
    {
        id: "cloud-architect",
        title: "Cloud Architect",
        categories: ["Cloud"],
        description: "A cloud architect designs and plans cloud environments, depending on the needs of their organization.",
        icon: <Cloud className="w-6 h-6" />,
        stats: {
            global: { listings: "35,000+", salary: "$140,000", projected: "180,000" },
            india: { listings: "10,000+", salary: "₹22,00,000", projected: "60,000" }
        },
        overview: "Cloud Architects are responsible for managing an organization's cloud computing architecture. They have significant knowledge of cloud platforms like AWS, Azure, and Google Cloud.",
        outlook: "+27% (Much faster than average)"
    },

    // Cyber
    {
        id: "cybersecurity-engineer",
        title: "Cybersecurity Engineer",
        categories: ["Cyber"],
        description: "Learn more about cybersecurity engineer as the foundation of the IT industry. They work to keep systems operating, networks secure, and users productive.",
        icon: <Shield className="w-6 h-6" />,
        stats: {
            global: { listings: "47,000+", salary: "$103,000", projected: "150,000" },
            india: { listings: "18,000+", salary: "₹12,00,000", projected: "50,000" }
        },
        overview: "Cybersecurity Engineers identify threats and vulnerabilities in systems and software, and devise strategies to protect an organization from cyber attacks. They are the builders of secure systems.",
        outlook: "+33% (Much faster than average)"
    },
    {
        id: "cybersecurity-specialist",
        title: "Cybersecurity Specialist",
        categories: ["Cyber"],
        description: "Cybersecurity specialists plan, implement, upgrade, and monitor security measures to protect computer networks and information.",
        icon: <Shield className="w-6 h-6" />,
        stats: {
            global: { listings: "42,000+", salary: "$98,000", projected: "160,000" },
            india: { listings: "15,000+", salary: "₹10,00,000", projected: "45,000" }
        },
        overview: "Cybersecurity Specialists are responsible for the security of an organization's computer systems and networks. They install security software, monitor notworks for security breaches, and respond to cyber attacks.",
        outlook: "+31% (Much faster than average)"
    },
    {
        id: "cybersecurity-manager",
        title: "Cybersecurity Manager",
        categories: ["Cyber"],
        description: "A cybersecurity manager is in charge of the overall cyber safety of an organization. This is an advanced-level job role that includes managing a staff of cybersecurity professionals.",
        icon: <Users className="w-6 h-6" />,
        stats: {
            global: { listings: "20,000+", salary: "$150,000", projected: "80,000" },
            india: { listings: "5,000+", salary: "₹28,00,000", projected: "15,000" }
        },
        overview: "Cybersecurity Managers oversee the cybersecurity department of an organization. They create and implement security policies, manage security audits, and oversee the response to security incidents.",
        outlook: "+28% (Much faster than average)"
    },
    {
        id: "cybersecurity-analyst",
        title: "Cybersecurity Analyst",
        categories: ["Cyber"],
        description: "A cybersecurity analyst plans, implements, upgrades, and monitors security measures to protect computer networks and information and assess system vulnerabilities.",
        icon: <Search className="w-6 h-6" />,
        stats: {
            global: { listings: "38,000+", salary: "$100,000", projected: "140,000" },
            india: { listings: "14,000+", salary: "₹9,50,000", projected: "40,000" }
        },
        overview: "Cybersecurity Analysts monitor an organization's networks for security breaches and investigate a violation when one occurs. They install and use software, such as firewalls and data encryption programs.",
        outlook: "+32% (Much faster than average)"
    },
    {
        id: "penetration-tester",
        title: "Penetration Tester",
        categories: ["Cyber"],
        description: "Penetration testers, also known as ethical hackers, simulate cyberattacks on an organization’s systems, networks, and applications to identify vulnerabilities.",
        icon: <Shield className="w-6 h-6" />,
        stats: {
            global: { listings: "18,000+", salary: "$110,000", projected: "60,000" },
            india: { listings: "6,000+", salary: "₹15,00,000", projected: "20,000" }
        },
        overview: "Penetration Testers are hired to probe an organization's network and systems to find security vulnerabilities that an attacker could exploit. They use the same tools and techniques as malicious hackers.",
        outlook: "+34% (Much faster than average)"
    },
    {
        id: "it-manager",
        title: "IT Manager",
        categories: ["AI", "Cloud", "Cyber", "Data", "Network"],
        description: "An IT manager oversees the technology infrastructure of an organization, ensuring that systems, networks, and data are secure and functioning efficiently.",
        icon: <Users className="w-6 h-6" />,
        stats: {
            global: { listings: "200,000+", salary: "$130,000", projected: "550,000" },
            india: { listings: "70,000+", salary: "₹20,00,000", projected: "150,000" }
        },
        overview: "IT Managers plan, direct, and coordinate the activities in such fields as electronic data processing, information systems, systems analysis, and computer programming.",
        outlook: "+11% (Faster than average)"
    },
    {
        id: "cybersecurity-architect",
        title: "Cybersecurity Architect",
        categories: ["Cyber"],
        description: "A cybersecurity architect collaborates with business leaders, engineers, developers, and others to protect an organization from cyber threats.",
        icon: <Shield className="w-6 h-6" />,
        stats: {
            global: { listings: "15,000+", salary: "$135,000", projected: "50,000" },
            india: { listings: "4,000+", salary: "₹30,00,000", projected: "12,000" }
        },
        overview: "Cybersecurity Architects design, build, and oversee the implementation of network and computer security for an organization. They create complex security structures and ensure that they work effectively.",
        outlook: "+29% (Much faster than average)"
    },
    {
        id: "it-auditor",
        title: "IT Auditor",
        categories: ["Cyber"],
        description: "An IT auditor evaluates an organization’s IT systems, processes, and controls to ensure they are secure, efficient, and compliant with regulations.",
        icon: <Search className="w-6 h-6" />,
        stats: {
            global: { listings: "22,000+", salary: "$95,000", projected: "90,000" },
            india: { listings: "8,000+", salary: "₹11,00,000", projected: "25,000" }
        },
        overview: "IT Auditors examine and evaluate an organization's information technology infrastructure, policies, and operations. They determine whether IT controls protect corporate assets and data integrity.",
        outlook: "+14% (Faster than average)"
    },

    // Data
    {
        id: "web-developer",
        title: "Web Developer",
        categories: ["Data"],
        description: "Web developers blend creativity and coding to develop and implement websites, web applications, application databases, and interactive web interfaces.",
        icon: <Globe className="w-6 h-6" />,
        stats: {
            global: { listings: "180,000+", salary: "$80,000", projected: "850,000" },
            india: { listings: "90,000+", salary: "₹6,00,000", projected: "300,000" }
        },
        overview: "Web Developers design and create websites. They are responsible for the look of the site, as well as the site's technical aspects, such as its performance and capacity.",
        outlook: "+13% (Faster than average)"
    },
    {
        id: "database-administrator",
        title: "Database Administrator",
        categories: ["Data"],
        description: "Database administrators are the gatekeepers of information. With the rise of big data, a career in database administration can be very lucrative for someone who is organized and security focused.",
        icon: <Database className="w-6 h-6" />,
        stats: {
            global: { listings: "30,000+", salary: "$98,000", projected: "130,000" },
            india: { listings: "10,000+", salary: "₹10,00,000", projected: "40,000" }
        },
        overview: "Database Administrators (DBAs) use specialized software to store and organize data, such as financial information and customer shipping records. They ensure that data is available to users and secure from unauthorized access.",
        outlook: "+8% (As fast as average)"
    },
    {
        id: "ui-ux-designer",
        title: "UI/UX Designer",
        categories: ["Data"],
        description: "A UI/UX designer creates user-centered designs for digital products by conducting user research, developing wireframes, and designing visually appealing interfaces.",
        icon: <Layers className="w-6 h-6" />,
        stats: {
            global: { listings: "40,000+", salary: "$90,000", projected: "200,000" },
            india: { listings: "15,000+", salary: "₹8,00,000", projected: "60,000" }
        },
        overview: "UI/UX Designers focus on the look and feel of a product. They ensure that the product is easy to use and visually appealing. They work closely with developers and product managers to create the best user experience.",
        outlook: "+12% (Faster than average)"
    },
    {
        id: "data-analyst",
        title: "Data Analyst",
        categories: ["Data"],
        description: "A data analyst works closely with an organization’s data to assist in making better business decisions and provide insights that support decision-making efforts.",
        icon: <TrendingUp className="w-6 h-6" />,
        stats: {
            global: { listings: "80,000+", salary: "$85,000", projected: "400,000" },
            india: { listings: "30,000+", salary: "₹7,50,000", projected: "120,000" }
        },
        overview: "Data Analysts collect, process, and perform statistical analyses on large datasets. They discover how data can be used to answer questions and solve problems. They translate figures into plain English to help organizations make better business decisions.",
        outlook: "+20% (Much faster than average)"
    },
    {
        id: "data-engineer",
        title: "Data Engineer",
        categories: ["Data"],
        description: "Data engineers design, build, and maintain the infrastructure and systems needed to collect, store, and process large volumes of data for analysis and decision-making.",
        icon: <Database className="w-6 h-6" />,
        stats: {
            global: { listings: "55,000+", salary: "$120,000", projected: "250,000" },
            india: { listings: "18,000+", salary: "₹14,00,000", projected: "70,000" }
        },
        overview: "Data Engineers build the systems that collect, manage, and convert raw data into usable information for data scientists and business analysts to interpret. Their ultimate goal is to make data accessible so that organizations can use it to evaluate and optimize their performance.",
        outlook: "+21% (Much faster than average)"
    },
    {
        id: "qa-tester",
        title: "QA Tester",
        categories: ["Data"],
        description: "A software quality assurance tester ensures that software or products meet quality standards by identifying and reporting bugs or issues during the development process.",
        icon: <Code className="w-6 h-6" />,
        stats: {
            global: { listings: "65,000+", salary: "$75,000", projected: "300,000" },
            india: { listings: "25,000+", salary: "₹6,00,000", projected: "90,000" }
        },
        overview: "QA Testers are responsible for finding bugs and issues in software before it reaches the end user. They run tests on software applications to ensure they function properly and meet all requirements.",
        outlook: "+15% (Faster than average)"
    },
    {
        id: "e-commerce-analyst",
        title: "E-commerce Analyst",
        categories: ["Data"],
        description: "An e-commerce analyst evaluates online sales data, website performance, and customer behavior to identify trends and optimize user experience.",
        icon: <TrendingUp className="w-6 h-6" />,
        stats: {
            global: { listings: "10,000+", salary: "$80,000", projected: "40,000" },
            india: { listings: "4,000+", salary: "₹7,00,000", projected: "15,000" }
        },
        overview: "E-commerce Analysts analyze data related to online sales to help companies improve their online presence and increase sales. They track website traffic, sales trends, and customer behavior.",
        outlook: "+10% (Faster than average)"
    },
    {
        id: "database-architect",
        title: "Database Architect",
        categories: ["Data"],
        description: "Database architects design, implement, and manage the structure and organization of databases to ensure efficient data storage, retrieval, and security.",
        icon: <Database className="w-6 h-6" />,
        stats: {
            global: { listings: "12,000+", salary: "$125,000", projected: "45,000" },
            india: { listings: "3,000+", salary: "₹18,00,000", projected: "10,000" }
        },
        overview: "Database Architects design and build huge databases for companies and organizations. They determine the best way to store and organize data so that it is secure and easily accessible.",
        outlook: "+9% (As fast as average)"
    },
    {
        id: "data-scientist",
        title: "Data Scientist",
        categories: ["Data"],
        description: "Data scientists analyze complex data to uncover patterns, generate insights, and build predictive models using statistical methods and machine learning.",
        icon: <Brain className="w-6 h-6" />,
        stats: {
            global: { listings: "35,000+", salary: "$130,000", projected: "140,000" },
            india: { listings: "12,000+", salary: "₹16,00,000", projected: "45,000" }
        },
        overview: "Data Scientists use scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data. They use techniques from statistics, machine learning, and computer science.",
        outlook: "+36% (Much faster than average)"
    },

    // Network & Tech Support (Remaining)
    {
        id: "network-administrator",
        title: "Network Administrator",
        categories: ["Network"],
        description: "A network administrator focuses on the day-to-day management and maintenance of existing networks, ensuring their optimal performance, security and availability.",
        icon: <Wifi className="w-6 h-6" />,
        stats: {
            global: { listings: "45,000+", salary: "$85,000", projected: "320,000" },
            india: { listings: "15,000+", salary: "₹5,00,000", projected: "100,000" }
        },
        overview: "Network Administrators are responsible for the daily operations of computer networks. They install, organize, and support an organization's computer systems, including local area networks (LANs), wide area networks (WANs), and other data communication systems.",
        outlook: "+5% (As fast as average)"
    },
    {
        id: "devops-engineer",
        title: "DevOps Engineer",
        categories: ["Network"],
        description: "A DevOps engineer bridges the gap between development and operations teams by automating and streamlining software development and deployment processes.",
        icon: <Code className="w-6 h-6" />,
        stats: {
            global: { listings: "40,000+", salary: "$125,000", projected: "160,000" },
            india: { listings: "15,000+", salary: "₹15,00,000", projected: "50,000" }
        },
        overview: "DevOps Engineers work with developers and IT staff to oversee the code releases. They are responsible for automating the process of software delivery and infrastructure changes.",
        outlook: "+25% (Much faster than average)"
    },
    {
        id: "help-desk-technician",
        title: "Help Desk Technician",
        categories: ["Tech Support"],
        description: "A help desk technician provides technical support to users by diagnosing and resolving computer issues, installing software, and offering guidance.",
        icon: <Monitor className="w-6 h-6" />,
        stats: {
            global: { listings: "47,000+", salary: "$53,000", projected: "228,000" },
            india: { listings: "20,000+", salary: "₹3,50,000", projected: "80,000" }
        },
        overview: "A help desk technician provides essential technical support to computer users. They handle customer inquiries and work diligently to resolve technical issues related to computer hardware, software, or networks. Support is provided through various channels such as phone, email, live chat, or screen sharing.",
        outlook: "+9% (As fast as average)"
    },
    {
        id: "computer-repair-technician",
        title: "Computer Repair Technician",
        categories: ["Tech Support"],
        description: "A computer repair technician diagnoses, repairs, and maintains computer hardware and software systems, ensuring optimal performance and functionality.",
        icon: <Terminal className="w-6 h-6" />,
        stats: {
            global: { listings: "25,000+", salary: "$45,000", projected: "100,000" },
            india: { listings: "10,000+", salary: "₹2,50,000", projected: "30,000" }
        },
        overview: "Computer Repair Technicians fix computers and servers. They also maintain computers to prevent future problems. They may work on individual computers or on an organization's network.",
        outlook: "+2% (Slower than average)"
    },
    {
        id: "tech-support-specialist",
        title: "Tech Support Specialist",
        categories: ["Tech Support"],
        description: "A tech support specialist performs a range of tasks, from installing software to setting up computer workspaces, and solves technical issues that arise on a daily basis.",
        icon: <Monitor className="w-6 h-6" />,
        stats: {
            global: { listings: "50,000+", salary: "$56,000", projected: "400,000" },
            india: { listings: "25,000+", salary: "₹4,00,000", projected: "120,000" }
        },
        overview: "Tech Support Specialists help people troubleshoot technical problems. They may work with customers who are having trouble with their Internet service or employees who are having trouble with their email.",
        outlook: "+10% (Faster than average)"
    },
    {
        id: "instructional-designer",
        title: "Instructional Designer",
        categories: ["Data", "AI"], // Good fit for AI content production context
        description: "An instructional designer mediates between AI and co-workers, bringing a human touch to powerful AI content production and training materials.",
        icon: <Brain className="w-6 h-6" />,
        stats: {
            global: { listings: "12,000+", salary: "$85,000", projected: "50,000" },
            india: { listings: "5,000+", salary: "₹9,00,000", projected: "20,000" }
        },
        overview: "Instructional Designers are pivotal in the AI era, ensuring that educational content and training programs leverage AI tools while maintaining pedagogical integrity and human connection.",
        outlook: "+15% (Faster than average)"
    }
];
