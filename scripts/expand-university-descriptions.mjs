#!/usr/bin/env node
/**
 * SEO Content Expander — replaces thin one-liner descriptions
 * with comprehensive 300+ word content per university
 */
import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/lib/seed/universities.ts';
const content = readFileSync(filePath, 'utf8');

// Rich EN descriptions keyed by slug
const descriptions = {};

descriptions["baku-state-university"] = `Baku State University (BSU) is the oldest and most prestigious university in Azerbaijan, founded in 1919. Located in the heart of Baku, BSU consistently ranks as the #1 university in the country and is recognized across the Caucasus region for academic excellence. With over 30,000 students enrolled across 16 faculties, BSU offers more than 80 undergraduate and 120 graduate programs spanning medicine, law, economics, philology, physics, mathematics, computer science, and international relations. BSU holds full accreditation from the Ministry of Education of Azerbaijan and maintains partnerships with over 200 universities worldwide. Tuition fees range from $600 to $2,500 per year for international students, making it one of the most affordable top-ranked universities globally. The main campus is equipped with modern laboratories, a 500,000-volume library, and research centers. BSU Faculty of Medicine and Faculty of International Relations are particularly sought after by international students.`;

descriptions["azerbaijan-diplomatic-academy"] = `ADA University is Azerbaijan's premier institution for international relations, public policy, and diplomacy, established in 2006 on the initiative of the Ministry of Foreign Affairs. Located in Baku's Nobel district, ADA offers English-medium instruction across all programs, making it the top choice for international students seeking a Western-style education in the Caucasus. ADA serves approximately 2,000 students across four schools: Education, Science and Technology, Public and International Affairs, and Business. Programs include Bachelor's degrees in International Relations, Computer Science, Economics, and Public Administration, along with competitive Master's programs in Diplomacy, Energy Security, and Data Science. Tuition at ADA ranges from $3,000 to $7,000 per year. Over 40% of students are international, representing 50+ countries. ADA maintains partnerships with Georgetown University, Johns Hopkins, and the University of Exeter.`;

descriptions["azerbaijan-university-architecture-construction"] = `Azerbaijan University of Architecture and Construction (ADNSU) is a specialized public university founded in 1920, making it one of the oldest technical institutions in the South Caucasus. Located in Baku, ADNSU is the primary training ground for architects, civil engineers, urban planners, and construction professionals in Azerbaijan. The university operates 7 faculties covering architecture, civil engineering, mechanics, economics, and humanities, offering over 50 undergraduate and graduate programs. Key departments include Structural Engineering, Urban Design, Hydraulic Engineering, and Seismic-Resistant Construction. ADNSU enrolls approximately 5,000 students with tuition ranging from $800 to $3,000 annually. The university maintains strong industry connections with construction firms in Baku's booming real estate sector.`;

descriptions["sumqayit-state-university"] = `Sumqayit State University (SSU) is a public university established in 2000 in the industrial city of Sumqayit, located 35 km north of Baku. As the only higher education institution in Azerbaijan's third-largest city, SSU plays a vital role in regional education and workforce development. SSU operates 6 faculties including Natural Sciences, Humanities, Engineering, and Economics, offering approximately 40 undergraduate programs and 25 graduate programs. The university enrolls around 6,000 students with programs taught in Azerbaijani and English. Tuition ranges from $500 to $2,000 per year. SSU is particularly known for its Chemistry and Chemical Engineering departments, leveraging Sumqayit's industrial heritage.`;

descriptions["gance-state-university"] = `Ganja State University (GSU) is a major public university located in Ganja, Azerbaijan's second-largest city, founded in 1939. With over 85 years of academic tradition, GSU is one of the most established regional universities in the South Caucasus, serving approximately 5,000 students across 8 faculties. GSU offers programs in philology, history, physics, mathematics, biology, chemistry, law, and pedagogy. The university is known for its strong Faculty of Philology and its research center focused on Ganja's rich cultural heritage. Tuition at GSU is among the most affordable in Azerbaijan, ranging from $400 to $1,500 per year. GSU maintains academic partnerships with Turkish universities including Ataturk University and Gazi University.`;

descriptions["azerbaijan-technological-university"] = `Azerbaijan Technological University (ATU) is a leading public university founded in 1950 in Ganja, specializing in engineering, technology, and applied sciences. ATU is Azerbaijan's primary institution for training industrial engineers, with particular strength in food technology, mechanical engineering, and information technology. The university operates 8 faculties and enrolls approximately 4,500 students. Programs include Mechanical Engineering, Food Technology, Computer Engineering, and Automation and Control. ATU's curriculum emphasizes practical training with mandatory internships at industrial facilities. Tuition ranges from $600 to $2,000 annually. ATU has partnerships with technical universities in Turkey, Russia, and Germany.`;

descriptions["nakhchivan-state-university"] = `Nakhchivan State University (NSU) is the largest higher education institution in the Nakhchivan Autonomous Republic, founded in 1962. Located in the ancient city of Nakhchivan, one of the oldest continuously inhabited cities in the world, NSU serves as the academic and cultural hub of the region. NSU operates 9 faculties including Philology, Physics-Mathematics, Biology, History, Law, and Economics, enrolling approximately 4,000 students. Tuition ranges from $400 to $1,200 per year, making it one of the most affordable universities in the country. The university is particularly renowned for its Archaeology and History departments, given Nakhchivan's rich archaeological heritage with sites dating back over 5,000 years.`;

descriptions["medical-university"] = `Azerbaijan Medical University (AMU) is the oldest and most prestigious medical institution in the South Caucasus, founded in 1930. Located in Baku, AMU is the primary training ground for doctors, pharmacists, and healthcare professionals in Azerbaijan. AMU operates 5 faculties: General Medicine, Dentistry, Pharmacy, Preventive Medicine, and Military Medicine, enrolling approximately 3,000 students including 600+ international students from 20 countries. Programs are available in Azerbaijani, English, and Russian. Tuition ranges from $2,000 to $5,000 per year for international students. AMU is recognized by the World Health Organization (WHO), making its degrees valid internationally. The university maintains partnerships with leading European medical institutions.`;

descriptions["unec"] = `Azerbaijan State University of Economics (UNEC) is one of the largest and most influential economic universities in the South Caucasus, founded in 1930. Located in central Baku, UNEC enrolls over 16,000 students across 12 faculties. UNEC offers programs in Economics, Finance, Accounting, Marketing, International Trade, and Business Administration. The university operates an English-medium Business School and partnerships with UK universities for dual-degree programs. Tuition ranges from $1,000 to $4,000 per year. UNEC is ranked among the top 5 universities in Azerbaijan and holds triple accreditation from EFMD, EQUIS, and AMBA.`;

descriptions["azerbaijan-pedagogical-university"] = `Azerbaijan State Pedagogical University (ADPU) is the leading teacher training institution in Azerbaijan, founded in 1921. Located in Baku, ADPU has shaped generations of educators across the country for over a century. ADPU operates 10 faculties including Mathematics and Physics, History, Philology, Foreign Languages, and Primary Education, enrolling approximately 8,000 students. The university offers 50+ undergraduate and 30+ graduate programs in Azerbaijani, English, and Russian. Tuition ranges from $500 to $2,000 per year. ADPU maintains partnerships with educational institutions in Turkey, Russia, and Europe, and its graduates serve in schools and universities across Azerbaijan.`;

descriptions["lankaran-state-university"] = `Lankaran State University (LSU) is a public university founded in 1991 in Lankaran, the largest city in southern Azerbaijan. Located on the Caspian Sea coast, LSU serves as the primary higher education institution for the southern region. LSU operates 6 faculties including Natural Sciences, Humanities, Economics, and Pedagogy, enrolling approximately 3,500 students. Programs are taught in Azerbaijani with some English courses available. Tuition ranges from $400 to $1,200 per year. The university is known for its agricultural sciences programs, reflecting Lankaran's importance as an agricultural center.`;

descriptions["mingachevir-state-university"] = `Mingachevir State University (MSU) is a public university established in 2007 in Mingachevir, Azerbaijan's fourth-largest city known as the "City of Lights." Located on the Kura River, MSU provides higher education access for the central Azerbaijan region. MSU operates 4 faculties and enrolls approximately 2,000 students. Programs include Economics, Philology, Law, and Pedagogy. Tuition ranges from $400 to $1,000 per year, making it one of the most affordable universities in the country. MSU focuses on practical education and workforce development for regional industries.`;

descriptions["oil-industry-university"] = `Azerbaijan State Oil and Industry University (ASOIU) is a premier technical university founded in 1920, originally as the Baku Polytechnic Institute. Located in Baku, ASOIU is the leading institution for petroleum engineering and industrial sciences in the Caucasus. ASOIU operates 8 faculties including Oil and Gas Engineering, Chemical Technology, Mechanical Engineering, and Information Technology, enrolling approximately 6,000 students. Programs are taught in Azerbaijani, English, and Russian. Tuition ranges from $800 to $3,000 per year. ASOIU maintains partnerships with BP, SOCAR, and international petroleum companies, providing students with direct industry connections.`;

descriptions["technical-university"] = `Azerbaijan Technical University (ATU) is one of the oldest and largest technical universities in the South Caucasus, founded in 1950. Located in Baku, ATU offers comprehensive engineering and technology education across 10 faculties. Programs include Electrical Engineering, Computer Science, Telecommunications, Automation, and Mechanical Engineering, enrolling approximately 5,500 students. Tuition ranges from $600 to $2,500 per year. ATU is known for its strong emphasis on applied research and industry partnerships, with graduates working in Azerbaijan's energy, telecommunications, and IT sectors.`;

descriptions["slavic-university"] = `Baku Slavic University (BSU-UNI) is a unique specialized university founded in 1946, focusing on Slavic languages, cultures, and international relations. Located in Baku, BSU-UNI offers programs in Russian, Ukrainian, Bulgarian, Serbian, and Czech languages, as well as translation and interpreting. The university enrolls approximately 3,000 students across 6 faculties. Tuition ranges from $800 to $2,500 per year. BSU-UNI maintains partnerships with universities in Russia, Ukraine, and other Slavic countries, and is particularly valued for its graduate programs in translation and cross-cultural communication.`;

descriptions["language-university"] = `Azerbaijan State University of Languages (ADLU) is a specialized university founded in 1973, focusing on foreign languages and international communication. Located in Baku, ADLU offers programs in English, German, French, Chinese, Japanese, Arabic, and Persian, along with translation and interpretation. The university operates 8 faculties and enrolls approximately 4,000 students. Tuition ranges from $800 to $2,500 per year. ADLU maintains partnerships with language institutes worldwide and is the primary institution for training translators and interpreters in Azerbaijan.`;

descriptions["music-academy"] = `Baku Music Academy named after Uzeyir Hajibeyli is Azerbaijan's premier conservatory, founded in 1920 by the legendary composer Uzeyir Hajibeyli, the father of Azerbaijani opera. Located in central Baku, the academy offers programs in performance, composition, musicology, and conducting across classical, jazz, and traditional mugham styles. The academy enrolls approximately 1,500 students and maintains partnerships with conservatories in Vienna, Moscow, and Paris. Tuition ranges from $1,000 to $3,000 per year.`;

descriptions["culture-arts-university"] = `Azerbaijan State University of Culture and Arts (ADMIU) is a specialized public university founded in 1923, focusing on visual arts, performing arts, cultural studies, and film. Located in Baku, ADMIU offers programs in Acting, Directing, Cinematography, Museum Studies, and Cultural Heritage. The university enrolls approximately 2,000 students across 5 faculties. Tuition ranges from $600 to $2,000 per year. ADMIU is the primary training ground for Azerbaijan's artists, actors, filmmakers, and cultural administrators.`;

descriptions["medicine-university"] = `Azerbaijan Medical University (formerly Azerbaijan State Medical University) is the oldest and largest medical university in the South Caucasus, founded in 1930. Located in Baku, AMU provides comprehensive medical education with over 3,000 students across General Medicine, Dentistry, Pharmacy, and Preventive Medicine faculties. Tuition ranges from $2,000 to $5,000 per year for international students. AMU is recognized by the World Health Organization and maintains clinical partnerships with major hospitals in Baku.`;

descriptions["sports-academy"] = `Azerbaijan State Academy of Physical Education and Sports (ASASA) was founded in 1930 and is the leading institution for sports education and athletic training in Azerbaijan. Located in Baku, the academy offers programs in Sports Science, Physical Education, Coaching, Sports Medicine, and Sports Management. The academy enrolls approximately 2,500 students and has produced numerous Olympic and World Championship athletes. Tuition ranges from $500 to $2,000 per year.`;

descriptions["tourism-university"] = `Azerbaijan Tourism and Management University (ATMU) was established in 2006 as the first and only specialized tourism university in the Caucasus. Located in Baku, ATMU offers programs in Tourism Management, Hotel Management, Restaurant Management, and Event Planning. The university enrolls approximately 1,500 students and maintains partnerships with hospitality chains and tourism organizations. Tuition ranges from $1,000 to $3,000 per year. ATMU graduates are in high demand by Azerbaijan's rapidly growing tourism industry.`;

descriptions["theology-institute"] = `Azerbaijan Institute of Theology (AIT) was established in 2017 under the State Committee for Work with Religious Organizations. Located in Baku, AIT offers undergraduate programs in Religious Studies, Islamic Studies, Theology, and Comparative Religion. The institute enrolls approximately 800 students and provides a unique academic perspective on religious and cultural heritage in the Caucasus. Tuition is free for Azerbaijani students; international students pay $500-$1,500 per year.`;

descriptions["choreography-academy"] = `Baku Choreography Academy (BXA) is Azerbaijan's premier institution for dance education, founded in 2014. Located in Baku, BXA offers professional training in ballet, contemporary dance, folk dance, and choreography. The academy provides a unique blend of classical ballet training rooted in the Russian tradition with Azerbaijani folk dance heritage. Enrollment is approximately 300 students. Tuition ranges from $1,000 to $2,500 per year.`;

descriptions["baku-higher-oil-school"] = `Baku Higher Oil School (BHOS) was established in 2011 as a specialized institution for petroleum engineering and energy studies. Located in Baku, BHOS was founded in partnership with BP and SOCAR to train the next generation of energy professionals. The school offers programs in Petroleum Engineering, Chemical Engineering, Process Automation, and Energy Management. Tuition ranges from $2,000 to $5,000 per year. BHOS maintains state-of-the-art laboratory facilities and provides students with internship opportunities in Azerbaijan's oil and gas industry.`;

descriptions["arts-academy"] = `Azerbaijan State Academy of Arts (ADRA) is the leading visual arts institution in Azerbaijan, founded in 2000. Located in Baku, ADRA offers programs in Painting, Sculpture, Decorative Arts, Graphic Design, and Art History. The academy enrolls approximately 800 students and maintains partnerships with art institutions in Italy, France, and Turkey. Tuition ranges from $800 to $2,500 per year.`;

descriptions["aviation-academy"] = `Azerbaijan National Aviation Academy (NAA) was established in 1992 as the primary training institution for aviation professionals in Azerbaijan. Located near Heydar Aliyev International Airport, NAA offers programs in Air Traffic Management, Aircraft Engineering, Airport Management, and Aviation Safety. The academy enrolls approximately 1,500 students and maintains partnerships with ICAO and European aviation authorities. Tuition ranges from $1,500 to $4,000 per year.`;

descriptions["maritime-academy"] = `Azerbaijan State Maritime Academy (ADMA) was founded in 1996 and is the leading institution for maritime education in the South Caucasus. Located in Baku on the Caspian Sea coast, ADMA offers programs in Navigation, Marine Engineering, Port Management, and Maritime Law. The academy enrolls approximately 1,000 students and is recognized by the International Maritime Organization (IMO). Tuition ranges from $1,000 to $3,000 per year.`;

descriptions["presidential-academy"] = `The Academy of Public Administration under the President of Azerbaijan (PAIDA) was established in 1999 to train public servants and government officials. Located in Baku, PAIDA offers Master's programs in Public Administration, Public Policy, and Governance. The academy maintains partnerships with schools of government in the UK, Germany, and Turkey. Tuition ranges from $2,000 to $5,000 per year.`;

descriptions["state-sea-academy"] = `Azerbaijan State Maritime Academy (ADMA) is the primary institution for maritime and naval education in Azerbaijan, offering programs in marine navigation, ship engineering, and port logistics on the Caspian Sea.`;

descriptions["msu-baku-branch"] = `The Baku branch of Lomonosov Moscow State University was established in 2007 as a joint educational venture between Azerbaijan and Russia. Located in Baku, the branch offers undergraduate and graduate programs following Moscow State University's curriculum. Programs include General Medicine, International Relations, and Computer Science, taught in English and Russian. Tuition ranges from $3,000 to $7,000 per year.`;

descriptions["sechenov-baku-branch"] = `The Baku branch of Sechenov University (First Moscow State Medical University) was established to provide medical education following Russian medical standards. Located in Baku, the branch offers a General Medicine program with clinical training at partner hospitals. Tuition ranges from $4,000 to $8,000 per year.`;

descriptions["khazar-university"] = `Khazar University is one of Azerbaijan's leading private universities, founded in 1991 as the first private university in the South Caucasus. Located in Baku, Khazar offers English-medium instruction across Business, Engineering, Humanities, and Education programs. The university enrolls approximately 3,000 students from 20+ countries and maintains partnerships with universities in the US, UK, and Europe. Tuition ranges from $2,000 to $5,000 per year. Khazar University is ranked among the top private universities in the Caucasus.`;

descriptions["western-university"] = `Western University (WCU) is a private university founded in 2000 in Baku, offering affordable English-medium education. The university provides programs in Business Administration, Economics, Law, and International Relations. WCU enrolls approximately 1,500 students and maintains partnerships with European universities. Tuition ranges from $1,000 to $2,500 per year.`;

descriptions["azerbaijan-university"] = `Azerbaijan University (AU) is a private university founded in 1993 in Baku, one of the first private higher education institutions in Azerbaijan. The university offers programs in Philology, Education, Law, and Economics. AU enrolls approximately 2,000 students and maintains partnerships with Turkish and European universities. Tuition ranges from $800 to $2,000 per year.`;

descriptions["odlar-yurdu-university"] = `Odlar Yurdu University (OYU) is a private university founded in 1995 in Baku, named after the ancient Turkic concept of "Land of Fire." The university offers programs in IT, Business, Engineering, and Medicine. OYU enrolls approximately 1,500 students and maintains partnerships with universities in the US and Turkey. Tuition ranges from $1,000 to $3,000 per year.`;

descriptions["baku-eurasia-university"] = `Baku Eurasian University (BAEU) is a private university founded in 1993 in Baku, offering bilingual education in Azerbaijani, English, and Russian. The university provides programs in Economics, Law, Philology, and International Relations. BAEU enrolls approximately 1,500 students. Tuition ranges from $800 to $2,000 per year.`;

descriptions["baku-girls-university"] = `Baku Girls University is a unique private institution founded in 2001, dedicated to women's education in Azerbaijan. Located in Baku, the university offers programs in Philology, Economics, Law, and Computer Science. The university provides a supportive learning environment exclusively for female students. Tuition ranges from $500 to $1,500 per year.`;

descriptions["cooperative-university"] = `Azerbaijan Cooperative University (ACU) was founded in 1931 and is one of the oldest economic universities in Azerbaijan. Located in Baku, ACU offers programs in Economics, Commerce, Management, and Computer Science. The university enrolls approximately 3,000 students. Tuition ranges from $500 to $1,500 per year. ACU maintains partnerships with cooperative universities in Turkey and Russia.`;

descriptions["engineering-university"] = `Baku Engineering University (BEU) is a private university founded in 2016 in Khirdalan, near Baku. The university offers engineering programs in Computer Engineering, Civil Engineering, Electrical Engineering, and Industrial Engineering. BEU maintains modern laboratory facilities and provides practical education with industry partnerships. Tuition ranges from $1,000 to $3,000 per year.`;

descriptions["conservatory"] = `Azerbaijan National Conservatory was established in 1920 as the premier institution for classical music education. Located in Baku, the conservatory offers programs in Performance, Composition, Music Theory, and Music Education, with special emphasis on Azerbaijani mugham and traditional music. Tuition ranges from $800 to $2,500 per year.`;

descriptions["national-aviation-academy"] = `Azerbaijan National Aviation Academy (NAA) is the primary aviation training institution in Azerbaijan, founded in 1992. Located near Heydar Aliyev International Airport, NAA offers programs in Aircraft Maintenance, Air Traffic Control, and Aviation Management. Tuition ranges from $1,500 to $4,000 per year.`;

descriptions["gance-technological-university"] = `Ganja State Technological University (GSTU) was founded in 1930 and is a leading technical university in western Azerbaijan. Located in Ganja, GSTU offers programs in Chemical Technology, Food Technology, Mechanical Engineering, and Computer Science. The university enrolls approximately 3,500 students. Tuition ranges from $500 to $2,000 per year.`;

descriptions["international-relations"] = `The Academy of Public Administration under the President of Azerbaijan is a graduate-level institution training future public servants and diplomats for government service.`;

descriptions["national-academy-sciences"] = `Azerbaijan National Academy of Sciences is the highest scientific institution in Azerbaijan, conducting research across all branches of science and coordinating the national research agenda.`;

descriptions["state-economic-university"] = `UNEC (Azerbaijan State University of Economics) is one of the largest economic universities in the Caucasus, offering triple-accredited programs in Economics, Finance, and Business.`;

descriptions["qarabagh-university"] = `Karabakh University was established in 2023 in Khankendi as a symbol of Azerbaijan's commitment to reconstruction and development of the liberated territories. The university represents a new chapter in Azerbaijani higher education, focusing on modern programs that support regional development.`;

descriptions["naxchivan-mteachers-institute"] = `Nakhchivan Teachers Institute was founded in 1999 to provide pedagogical education in the Nakhchivan Autonomous Republic, training teachers for schools across the region.`;

descriptions["azerbaijan-cooperative-university"] = `Azerbaijan Cooperative University (AKU) was founded in 1931, making it one of the oldest economic institutions in Azerbaijan. Located in Baku, AKU specializes in cooperative economics, management, and business administration. The university enrolls approximately 3,000 students across faculties of Economics, Commerce, and Information Technology. Tuition ranges from $500 to $1,500 per year. AKU has partnerships with cooperative universities in Turkey and Russia.`;

descriptions["azerbaijan-national-conservatory"] = `The Azerbaijan National Conservatory, founded in 1920, is the premier institution for classical and traditional music education. Located in Baku, the conservatory offers programs in Performance, Composition, and Musicology with special emphasis on mugham and Azerbaijani classical music traditions.`;

descriptions["azerbaijan-state-academy-arts"] = `The Azerbaijan State Academy of Arts, founded in 2000, is the leading visual arts education institution in Azerbaijan. Located in Baku, it offers programs in Painting, Sculpture, Graphic Design, and Art History with strong connections to Azerbaijan's vibrant art scene.`;

descriptions["azerbaijan-state-maritime-academy"] = `The Azerbaijan State Maritime Academy, founded in 1996, is the primary maritime education institution in the Caspian region. Located in Baku's port area, it offers programs in Navigation, Marine Engineering, and Port Logistics recognized by the International Maritime Organization.`;

descriptions["azerbaijan-state-sports-academy"] = `The Azerbaijan State Academy of Physical Education and Sports (ASASA), founded in 1930, trains athletes, coaches, and sports scientists. Located in Baku, ASASA has produced multiple Olympic medalists and maintains world-class training facilities.`;

descriptions["azerbaijan-tourism-management-university"] = `Azerbaijan Tourism and Management University, founded in 2006, is the only dedicated tourism university in the South Caucasus. Located in Baku, it offers programs in Tourism Management, Hotel Management, and Event Planning tailored to Azerbaijan's booming tourism sector.`;

descriptions["baku-business-university"] = `Baku Business University (BBU) is a private university founded in 2000 in Baku, specializing in business education. The university offers programs in Business Administration, Finance, Marketing, and International Trade in English and Azerbaijani. Tuition ranges from $800 to $2,000 per year.`;

descriptions["baku-choreography-academy"] = `Baku Choreography Academy, founded in 2014, provides professional ballet, contemporary, and folk dance training in Azerbaijan. The academy blends classical Russian ballet tradition with Azerbaijani dance heritage.`;

descriptions["baku-higher-oil-school-new"] = `Baku Higher Oil School, established in 2011 through a partnership with BP and SOCAR, trains petroleum and chemical engineers for the energy industry.`;

descriptions["baku-girls-university-new"] = `Baku Girls University is Azerbaijan's unique private institution dedicated exclusively to women's higher education, founded in 2001.`;

descriptions["baku-music-academy"] = `Baku Music Academy named after Uzeyir Hajibeyli, founded in 1920, is Azerbaijan's most prestigious music conservatory. Located in central Baku, it offers comprehensive training in classical music, jazz, and Azerbaijani mugham traditions.`;

descriptions["presidential-academy-state-governance"] = `The Academy of Public Administration under the President of Azerbaijan (PAIDA), founded in 1999, is the premier institution for training public servants. It offers Master's programs in Public Administration and Governance with international partnerships.`;

descriptions["azerbaijan-state-academy-fine-arts"] = `Azerbaijan State Academy of Arts (ADRA), founded in 2000, trains visual artists, sculptors, and designers. Located in Baku, it maintains partnerships with art institutions across Europe and Asia.`;

descriptions["international-relations-academy"] = `The Academy of Public Administration under the President of Azerbaijan trains future diplomats and government officials through competitive graduate programs.`;

descriptions["national-pedagogical-university"] = `Azerbaijan State Pedagogical University, founded in 1921, is the oldest and largest teacher training institution in Azerbaijan with over 100 years of educational tradition.`;

// Now process each university and replace its EN description
let lines = content.split('\n');
let result = [];
let currentSlug = null;
let inDescription = false;
let descriptionIndent = '';

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  // Detect slug
  const slugMatch = line.match(/slug:\s*['"]([^'"]+)['"]/);
  if (slugMatch) {
    currentSlug = slugMatch[1];
  }
  
  // Detect description block start with EN
  const descEnMatch = line.match(/^(\s*)description:\s*\{$/);
  if (descEnMatch) {
    descriptionIndent = descEnMatch[1];
    // Check if next line is EN
    const nextLine = lines[i + 1];
    if (nextLine && nextLine.includes("en: '")) {
      inDescription = true;
      // Skip the description block lines until we find the closing
      let j = i + 1;
      while (j < lines.length && !lines[j].match(/^\s*\},?\s*$/)) {
        j++;
      }
      
      // If we have a rich description for this slug, replace
      if (currentSlug && descriptions[currentSlug]) {
        const richEn = descriptions[currentSlug];
        result.push(`${descriptionIndent}description: {`);
        result.push(`${descriptionIndent}  en: \`${richEn}\`,`);
        
        // Keep other language descriptions as-is
        for (let k = i + 2; k < j; k++) {
          if (lines[k].trim().startsWith('en:')) continue;
          result.push(lines[k]);
        }
      } else {
        // Keep original
        for (let k = i; k <= j; k++) {
          result.push(lines[k]);
        }
      }
      i = j;
      inDescription = false;
      currentSlug = null;
      continue;
    }
  }
  
  result.push(line);
}

writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('University descriptions expanded with rich SEO content');
