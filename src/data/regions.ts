export interface RegionData {
  id: string;
  name: string;
  zone: 'North' | 'West' | 'Central' | 'South' | 'East';
  points: string;
  centerX: number;
  centerY: number;
  population: string;
  area: string;
  description: string;
}

export const regions: RegionData[] = [
  {
    id: 'Chennai',
    name: 'Chennai',
    zone: 'North',
    points: '390,40 440,30 460,70 410,80',
    centerX: 425,
    centerY: 55,
    population: '7.1 Million',
    area: '426 km²',
    description: 'Capital city and primary urban hub. High density residential and commercial sectors.'
  },
  {
    id: 'Kanchipuram',
    name: 'Kanchipuram',
    zone: 'North',
    points: '340,70 410,80 395,120 330,110',
    centerX: 370,
    centerY: 95,
    population: '2.7 Million',
    area: '4,432 km²',
    description: 'Historic city known for temples and silk weaving, major industrial corridors.'
  },
  {
    id: 'Vellore',
    name: 'Vellore',
    zone: 'North',
    points: '260,50 340,70 330,110 270,95',
    centerX: 300,
    centerY: 80,
    population: '4.0 Million',
    area: '5,920 km²',
    description: 'Industrial and educational hub with major healthcare facilities (CMC).'
  },
  {
    id: 'Tiruvannamalai',
    name: 'Tiruvannamalai',
    zone: 'North',
    points: '270,95 330,110 350,170 280,180',
    centerX: 310,
    centerY: 140,
    population: '2.5 Million',
    area: '6,191 km²',
    description: 'Spiritual hub surrounded by hills. Large rural and forest cover zones.'
  },
  {
    id: 'Cuddalore',
    name: 'Cuddalore',
    zone: 'East',
    points: '350,170 410,160 400,225 340,210',
    centerX: 375,
    centerY: 195,
    population: '2.6 Million',
    area: '3,678 km²',
    description: 'Coastal district prone to cyclone impacts. Major port and industrial units.'
  },
  {
    id: 'Salem',
    name: 'Salem',
    zone: 'West',
    points: '190,150 280,180 270,230 180,210',
    centerX: 235,
    centerY: 190,
    population: '3.5 Million',
    area: '5,205 km²',
    description: 'Major steel and textile producer. Surrounded by mountainous terrains.'
  },
  {
    id: 'Erode',
    name: 'Erode',
    zone: 'West',
    points: '100,165 190,195 175,245 90,225',
    centerX: 140,
    centerY: 205,
    population: '2.3 Million',
    area: '5,722 km²',
    description: 'Agriculture and textile hub, major turmeric market hub.'
  },
  {
    id: 'Coimbatore',
    name: 'Coimbatore',
    zone: 'West',
    points: '75,245 175,245 155,325 65,305',
    centerX: 120,
    centerY: 285,
    population: '3.4 Million',
    area: '4,723 km²',
    description: 'The "Manchester of South India". Major manufacturing and engineering hub.'
  },
  {
    id: 'Trichy',
    name: 'Trichy',
    zone: 'Central',
    points: '220,230 300,220 320,295 230,305',
    centerX: 265,
    centerY: 260,
    population: '2.7 Million',
    area: '4,409 km²',
    description: 'Geographical center of Tamil Nadu. Major educational and fabrication industries.'
  },
  {
    id: 'Thanjavur',
    name: 'Thanjavur',
    zone: 'Central',
    points: '320,295 300,220 390,230 410,275 370,320',
    centerX: 360,
    centerY: 280,
    population: '2.4 Million',
    area: '3,396 km²',
    description: 'The "Rice Bowl of Tamil Nadu". Culturally rich delta region.'
  },
  {
    id: 'Dindigul',
    name: 'Dindigul',
    zone: 'South',
    points: '155,325 230,305 240,370 160,380',
    centerX: 195,
    centerY: 345,
    population: '2.2 Million',
    area: '6,266 km²',
    description: 'Known for lock manufacturing and hill stations (Kodaikanal).'
  },
  {
    id: 'Madurai',
    name: 'Madurai',
    zone: 'South',
    points: '200,380 265,370 285,435 210,445',
    centerX: 240,
    centerY: 410,
    population: '3.0 Million',
    area: '3,741 km²',
    description: 'Cultural capital. One of the oldest continuously inhabited cities.'
  },
  {
    id: 'Ramanathapuram',
    name: 'East',
    zone: 'East',
    points: '285,435 370,445 350,490 275,475',
    centerX: 320,
    centerY: 460,
    population: '1.4 Million',
    area: '4,104 km²',
    description: 'Coastal peninsula. Contains spiritual site Rameswaram and fishing corridors.'
  },
  {
    id: 'Thoothukudi',
    name: 'Thoothukudi',
    zone: 'South',
    points: '210,445 275,475 255,530 195,520',
    centerX: 235,
    centerY: 495,
    population: '1.7 Million',
    area: '4,621 km²',
    description: 'Major sea port and chemical industrial zone. Pearl fishery coast.'
  },
  {
    id: 'Tirunelveli',
    name: 'Tirunelveli',
    zone: 'South',
    points: '120,455 195,520 175,550 100,520',
    centerX: 150,
    centerY: 500,
    population: '3.0 Million',
    area: '6,823 km²',
    description: 'Ancient city on Thamirabarani river, heavy agro-industrial economy.'
  },
  {
    id: 'Kanyakumari',
    name: 'Kanyakumari',
    zone: 'South',
    points: '100,520 175,550 150,590 110,580',
    centerX: 130,
    centerY: 560,
    population: '1.9 Million',
    area: '1,684 km²',
    description: 'Southernmost tip of mainland India. Highly literate, coastal and tourist hub.'
  }
];
