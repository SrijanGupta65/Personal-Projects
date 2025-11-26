import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Section from '../components/Section';
import Footer from '../components/Footer';
import { usePlants } from '../context/PlantContext';
import { useNavigate } from 'react-router-dom';

import vegetationImg from '../assets/img/vegetation.png';
import fruitsImg     from '../assets/img/fruits.png';
import indoorImg     from '../assets/img/indoor-florals.png';
import sunflowerImg  from '../assets/img/sunflower.png';
import tulipImg      from '../assets/img/tulip.png';
import tigerLilyImg  from '../assets/img/tiger-lily.png';
import peasImg       from '../assets/img/peas.png';
import leafIcon      from '../assets/img/Leaf.png';
import nooktaRoseImg from '../assets/img/nookta-rose.png';
import osoberryImg   from '../assets/img/osoberry.png';
import hobartFarmImg from '../assets/img/hobart-farm.jpg';

// Import plant-specific images
import glossyBuckthorn from '../assets/img/Glossy Buckthorn.png';
import goldenShower from '../assets/img/Golden Shower.png';
import loquat from '../assets/img/Loquat.png';
import apocynum from '../assets/img/Apocynum.jpg';
import bahamaMaidenbush from '../assets/img/Bahama Maidenbush.png';
import bouchea from '../assets/img/Bouchea.png';
import bouchetia from '../assets/img/Bouchetia.png';
import broadleafFalseCarrot from '../assets/img/Broadleaf False Carrot.png';
import calamint from '../assets/img/Calamint.png';
import chelsau from '../assets/img/Chelsau.png';
import chisosMountainPricklypear from '../assets/img/Chisos Mountain Pricklypear.png';
import costus from '../assets/img/Costus.png';
import cupLichen from '../assets/img/Cup Lichen.png';
import diplotommaLichen from '../assets/img/Diplotomma Lichen.png';
import duchesneRiverTwinpod from '../assets/img/Duchesne River Twinpod.png';
import dudleysSwordfern from '../assets/img/Dudley\'s Swordfern.png';
import dwarfUmbrellasedge from '../assets/img/Dwarf Umbrella-sedge.png';
import easternFournervedDaisy from '../assets/img/Eastern Fournerved Daisy.png';
import fewflowerFumitory from '../assets/img/Few-flower Fumitory.png';
import greenspotNightshade from '../assets/img/Greenspot Nightshade.png';
import hairyseedPaspalum from '../assets/img/Hairyseed Paspalum.png';
import hoaryTansyaster from '../assets/img/Hoary Tansyaster.png';
import indusiellaMoss from '../assets/img/Indusiella Moss.png';
import janusia from '../assets/img/Janusia.png';
import jauJau from '../assets/img/Jau Jau.png';
import johnstonsPhlox from '../assets/img/Johnston\'s Phlox.png';
import junghuhnsSphagnum from '../assets/img/Junghuhn\'s Sphagnum.png';
import melaspileaLichen from '../assets/img/Melaspilea Lichen.png';
import northernWildrice from '../assets/img/Northern Wildrice.png';
import palmersZinnia from '../assets/img/Palmer\'s Zinnia.png';
import parrysLipfern from '../assets/img/Parry\'s Lipfern.png';
import prairieBishop from '../assets/img/Prairie Bishop.png';
import prinkavasPrickleypear from '../assets/img/Prinkava\'s Prickleypear.png';
import puertoRicoIndigoberry from '../assets/img/Puerto Rico Indigoberry.png';
import scriptLichen from '../assets/img/Script Lichen.png';
import sedge from '../assets/img/Sedge.png';
import showyDraba from '../assets/img/Showy Draba.png';
import sonoranWaterwillow from '../assets/img/Sonoran Water-willow.png';
import spotlessBalm from '../assets/img/Spotless Balm.png';
import staghornClubmoss from '../assets/img/Staghorn Clubmoss.png';
import streambankCyanea from '../assets/img/Streambank Cyanea.png';
import szechuanWhiteBirch from '../assets/img/Szechuan White Birch.png';
import tropicalFalseGoldeneye from '../assets/img/Tropical False Goldeneye.png';
import umbrellaIndianMallow from '../assets/img/Umbrella Indian Mallow.png';
import waioliValleyMaidenFern from '../assets/img/Waioli Valley Maiden Fern.png';
import walpolesPoppy from '../assets/img/Walpole\'s Poppy.png';
import willowCyanea from '../assets/img/Willow Cyanea.png';
import wingedWattle from '../assets/img/Winged Wattle.png';
import woodLily from '../assets/img/Wood Lily.png';
import yellowCoralroot from '../assets/img/Yellow Coralroot.png';
import yellowPondlily from '../assets/img/Yellow Pond-lily.png';

export default function RecommendPage() {
  const { addPlants } = usePlants();
  const navigate = useNavigate();
  // Sample data to ensure we have plants to display
  const samplePlants = [
    { plant_name: "Tomato", category: "Vegetable", difficulty: "easy", location: "Mediterranean, South America", zipcode: "98105" },
    { plant_name: "Carrot", category: "Vegetable", difficulty: "easy", location: "Europe, Asia", zipcode: "98107" },
    { plant_name: "Cucumber", category: "Vegetable", difficulty: "medium", location: "India", zipcode: "98115" },
    { plant_name: "Apple", category: "Fruits", difficulty: "hard", location: "Central Asia", zipcode: "98103" },
    { plant_name: "Strawberry", category: "Fruits", difficulty: "medium", location: "North America, Europe", zipcode: "98105" },
    { plant_name: "Blueberry", category: "Fruits", difficulty: "medium", location: "North America", zipcode: "98112" },
    { plant_name: "Rose", category: "Flower", difficulty: "medium", location: "Asia, Europe, North America", zipcode: "98105" },
    { plant_name: "Tulip", category: "Flower", difficulty: "easy", location: "Central Asia, Turkey", zipcode: "98107" },
    { plant_name: "Orchid", category: "Flower", difficulty: "hard", location: "Tropical regions worldwide", zipcode: "98115" },
    { plant_name: "Lettuce", category: "Vegetable", difficulty: "easy", location: "Mediterranean Basin", zipcode: "98103" },
    { plant_name: "Spinach", category: "Vegetable", difficulty: "easy", location: "Central and Western Asia", zipcode: "98107" },
    { plant_name: "Broccoli", category: "Vegetable", difficulty: "medium", location: "Italy", zipcode: "98115" },
    { plant_name: "Orange", category: "Fruits", difficulty: "hard", location: "Southeast Asia", zipcode: "98103" },
    { plant_name: "Raspberry", category: "Fruits", difficulty: "medium", location: "Northern Europe, Asia", zipcode: "98112" },
    { plant_name: "Cherry", category: "Fruits", difficulty: "medium", location: "Europe, Western Asia", zipcode: "98105" },
    { plant_name: "Daisy", category: "Flower", difficulty: "easy", location: "Europe, North America", zipcode: "98107" },
    { plant_name: "Lily", category: "Flower", difficulty: "medium", location: "Northern Hemisphere", zipcode: "98115" },
    { plant_name: "Sunflower", category: "Flower", difficulty: "easy", location: "North America", zipcode: "98103" }
  ].map(plant => ({ ...plant, isSaved: false }));  // Add isSaved property to each plant

  const [plantsData, setPlantsData] = useState(samplePlants);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [displayedPlants, setDisplayedPlants] = useState(samplePlants.slice(0, 6));
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [filters, setFilters] = useState({
    maintenance: {
      easy: false,
      medium: false,
      hard: false
    },
    category: {
      fruits: false,
      vegetables: false,
      flowers: false
    }
  });
  const [popupInfo, setPopupInfo] = useState(null);
  const [isViewingAll, setIsViewingAll] = useState(false);
  
  // Initialize savedPlants from localStorage
  const [savedPlants, setSavedPlants] = useState(() => {
    try {
      const saved = localStorage.getItem('savedPlants');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved plants:', error);
      return [];
    }
  });
  const [isViewingSaved, setIsViewingSaved] = useState(false);

  // Update plants data with saved status when component mounts
  useEffect(() => {
    const updatePlantsWithSavedStatus = (plants) => {
      return plants.map(plant => ({
        ...plant,
        isSaved: savedPlants.some(saved => saved.plant_name === plant.plant_name)
      }));
    };

    // Update initial plants data
    setPlantsData(prevPlants => updatePlantsWithSavedStatus(prevPlants));
    setDisplayedPlants(prevDisplayed => updatePlantsWithSavedStatus(prevDisplayed));
  }, [savedPlants]);

  // Load CSV data
  useEffect(() => {
    fetch('/data/Plants-data.csv')
      .then(response => response.text())
      .then(csvText => {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        const parsedData = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',');
            const plant = {};
            headers.forEach((header, index) => {
              plant[header] = values[index];
            });
            // Check if this plant is saved
            const isSaved = savedPlants.some(saved => saved.plant_name === plant.plant_name);
            return { ...plant, isSaved };
          });
        
        if (parsedData.length > 0) {
          setPlantsData(parsedData);
          setDisplayedPlants(parsedData.slice(0, 6));
        }
      })
      .catch(error => console.error('Error loading plants data:', error));
  }, [savedPlants]);

  // Update displayed plants when viewing saved plants
  useEffect(() => {
    if (isViewingSaved) {
      const updatedSavedPlants = savedPlants.map(plant => ({
        ...plant,
        isSaved: true // Ensure all saved plants have isSaved set to true
      }));
      setDisplayedPlants(updatedSavedPlants.slice(0, 6));
    }
  }, [isViewingSaved, savedPlants]);

  const handleSavePlant = (plant, isSaved) => {
    // Update saved plants list
    setSavedPlants(prevSaved => {
      let newSaved;
      if (!isSaved) {
        const isAlreadySaved = prevSaved.some(p => p.plant_name === plant.plant_name);
        if (isAlreadySaved) {
          return prevSaved; 
        }
        // Add to saved plants
        newSaved = [...prevSaved, plant];
      } else {
        // Remove from saved plants
        newSaved = prevSaved.filter(p => p.plant_name !== plant.plant_name);
      }
      // Save to localStorage
      localStorage.setItem('savedPlants', JSON.stringify(newSaved));
      return newSaved;
    });

    // Update plants in all relevant states
    const updatePlants = (plants) => 
      plants.map(p => 
        p.plant_name === plant.plant_name 
          ? {...p, isSaved: !isSaved} 
          : p
      );

    setPlantsData(prevData => updatePlants(prevData));
    setDisplayedPlants(prevDisplayed => updatePlants(prevDisplayed));
    if (filteredPlants.length > 0) {
      setFilteredPlants(prevFiltered => updatePlants(prevFiltered));
    }
    if (popupInfo?.plant_name === plant.plant_name) {
      setPopupInfo(prev => ({...prev, isSaved: !isSaved}));
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: {
        ...filters[filterType],
        [value]: !filters[filterType][value]
      }
    };
    
    setFilters(newFilters);
    
    // If changing category filter, clear the top category selection
    if (filterType === 'category' && newFilters.category[value]) {
      setSelectedCategory(null);
    }
    
    // Check if all filters are now unchecked
    const noFiltersActive = 
      Object.values(newFilters.maintenance).every(v => !v) && 
      Object.values(newFilters.category).every(v => !v) && 
      !selectedCategory;
    
    if (noFiltersActive) {
      // Reset to original state if no filters are active
      setFilteredPlants([]);
      setDisplayedPlants(plantsData.slice(0, 6));
      setCurrentPage(1);
      return;
    }
    
    // Apply all active filters
    let filtered = plantsData;
    
    // Apply maintenance filters
    const selectedMaintenance = Object.entries(newFilters.maintenance)
      .filter(([_, isSelected]) => isSelected)
      .map(([level]) => level);
    
    if (selectedMaintenance.length > 0) {
      filtered = filtered.filter(plant => 
        selectedMaintenance.includes(plant.difficulty.toLowerCase())
      );
    }
    
    // Apply category filters from checkboxes
    const selectedCategories = Object.entries(newFilters.category)
      .filter(([_, isSelected]) => isSelected)
      .map(([cat]) => {
        // Map checkbox categories to data categories
        if (cat === 'vegetables') return 'vegetable';
        if (cat === 'fruits') return 'fruits';
        if (cat === 'flowers') return 'flower';
        return cat;
      });
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(plant => 
        selectedCategories.includes(plant.category.toLowerCase())
      );
    } else if (selectedCategory) {
      // Only apply top category filter if no checkbox categories are selected
      filtered = filtered.filter(plant => 
        plant.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Store filtered results and display first page
    setFilteredPlants(filtered);
    setDisplayedPlants(filtered.slice(0, 6));
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * 6;
    const endIndex = startIndex + 6;
    
    // If we have filtered results, use those
    if (filteredPlants.length > 0) {
      setDisplayedPlants([...displayedPlants, ...filteredPlants.slice(startIndex, endIndex)]);
    } else {
      // Otherwise use all plants
      setDisplayedPlants([...displayedPlants, ...plantsData.slice(startIndex, endIndex)]);
    }
    
    setCurrentPage(nextPage);
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      // For search, show all exact matches
      const searchResults = plantsData.filter(plant => 
        plant.plant_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlants(searchResults);
      setDisplayedPlants(searchResults.slice(0, 6));
      setSelectedCategory(null);
      setCurrentPage(1);
    } else {
      // If search is cleared, return to previous filtered state
      if (isViewingAll) {
        setFilteredPlants(plantsData);
        setDisplayedPlants(plantsData.slice(0, 6));
      } else if (isFiltering) {
        // Reapply current filters
        handleFilterChange('category', Object.keys(filters.category).find(key => filters.category[key]) || '');
      } else {
        setFilteredPlants([]);
        setDisplayedPlants(plantsData.slice(0, 6));
      }
      setCurrentPage(1);
    }
  };

  // Filter summer plants for top picks
  const getSummerTopPicks = () => {
    // Get one plant from each category for summer season
    const summerVegetable = plantsData.find(plant => 
      plant.category.toLowerCase() === 'vegetable' && 
      (plant.season?.toLowerCase() === 'summer' || plant.plant_name === 'Tomato')
    ) || { plant_name: 'Tomato', category: 'Vegetable', difficulty: 'easy', location: 'Mediterranean, South America', zipcode: '98105' };
    
    const summerFruit = plantsData.find(plant => 
      plant.category.toLowerCase() === 'fruits' && 
      (plant.season?.toLowerCase() === 'summer' || plant.plant_name === 'Strawberry')
    ) || { plant_name: 'Strawberry', category: 'Fruits', difficulty: 'medium', location: 'North America, Europe', zipcode: '98105' };
    
    const summerFlower = plantsData.find(plant => 
      plant.category.toLowerCase() === 'flower' && 
      (plant.season?.toLowerCase() === 'summer' || plant.plant_name === 'Sunflower')
    ) || { plant_name: 'Sunflower', category: 'Flower', difficulty: 'easy', location: 'North America', zipcode: '98103' };
    
    return [
      { 
        src: hobartFarmImg, 
        alt: summerVegetable.plant_name, 
        caption: summerVegetable.category,
        location: summerVegetable.location || 'Mediterranean, South America',
        onClick: () => setPopupInfo(summerVegetable)
      },
      { 
        src: osoberryImg, 
        alt: summerFruit.plant_name, 
        caption: summerFruit.category,
        location: summerFruit.location || 'North America, Europe',
        onClick: () => setPopupInfo(summerFruit)
      },
      { 
        src: sunflowerImg, 
        alt: summerFlower.plant_name, 
        caption: summerFlower.category,
        location: summerFlower.location || 'North America',
        onClick: () => setPopupInfo(summerFlower)
      },
    ];
  };

  const topPicks = getSummerTopPicks();

  const getRecommendedPlants = () => {
    // If no saved plants, return default recommendations
    if (savedPlants.length === 0) {
      return [
        { src: peasImg, alt: 'Peas', caption: 'Try saving some plants to get personalized recommendations!' },
        { src: peasImg, alt: 'Peas', caption: 'Try saving some plants to get personalized recommendations!' },
        { src: peasImg, alt: 'Peas', caption: 'Try saving some plants to get personalized recommendations!' },
      ];
    }

    // Count preferences
    const preferences = {
      categories: {},
      difficulty: {}
    };

    savedPlants.forEach(plant => {
      // Count categories
      preferences.categories[plant.category] = (preferences.categories[plant.category] || 0) + 1;
      // Count difficulty levels
      preferences.difficulty[plant.difficulty] = (preferences.difficulty[plant.difficulty] || 0) + 1;
    });

    // Find most preferred category and difficulty
    const favoriteCategory = Object.entries(preferences.categories)
      .sort((a, b) => b[1] - a[1])[0][0];
    const favoriteDifficulty = Object.entries(preferences.difficulty)
      .sort((a, b) => b[1] - a[1])[0][0];

    // Filter plants based on preferences
    const recommendedPlants = plantsData
      .filter(plant => 
        !savedPlants.some(saved => saved.plant_name === plant.plant_name) &&
        (plant.category === favoriteCategory || plant.difficulty === favoriteDifficulty)
      )
      .slice(0, 3) // Get top 3 recommendations
      .map(plant => ({
        src: plant.plant_name === 'Glossy Buckthorn' ? glossyBuckthorn :
             plant.plant_name === 'Golden Shower' ? goldenShower :
             plant.plant_name === 'Loquat' ? loquat :
             plant.plant_name === 'Apocynum' ? apocynum :
             plant.plant_name === 'Bahama Maidenbush' ? bahamaMaidenbush :
             plant.plant_name === 'Bouchea' ? bouchea :
             plant.plant_name === 'Bouchetia' ? bouchetia :
             plant.plant_name === 'Broadleaf False Carrot' ? broadleafFalseCarrot :
             plant.plant_name === 'Calamint' ? calamint :
             plant.plant_name === 'Chelsau' ? chelsau :
             plant.plant_name === 'Chisos Mountain Pricklypear' ? chisosMountainPricklypear :
             plant.plant_name === 'Costus' ? costus :
             plant.plant_name === 'Cup Lichen' ? cupLichen :
             plant.plant_name === 'Diplotomma Lichen' ? diplotommaLichen :
             plant.plant_name === 'Duchesne River Twinpod' ? duchesneRiverTwinpod :
             plant.plant_name === 'Dudley\'s Swordfern' ? dudleysSwordfern :
             plant.plant_name === 'Dwarf Umbrella-sedge' ? dwarfUmbrellasedge :
             plant.plant_name === 'Eastern Fournerved Daisy' ? easternFournervedDaisy :
             plant.plant_name === 'Few-flower Fumitory' ? fewflowerFumitory :
             plant.plant_name === 'Greenspot Nightshade' ? greenspotNightshade :
             plant.plant_name === 'Hairyseed Paspalum' ? hairyseedPaspalum :
             plant.plant_name === 'Hoary Tansyaster' ? hoaryTansyaster :
             plant.plant_name === 'Indusiella Moss' ? indusiellaMoss :
             plant.plant_name === 'Janusia' ? janusia :
             plant.plant_name === 'Jau Jau' ? jauJau :
             plant.plant_name === 'Johnston\'s Phlox' ? johnstonsPhlox :
             plant.plant_name === 'Junghuhn\'s Sphagnum' ? junghuhnsSphagnum :
             plant.plant_name === 'Melaspilea Lichen' ? melaspileaLichen :
             plant.plant_name === 'Northern Wildrice' ? northernWildrice :
             plant.plant_name === 'Palmer\'s Zinnia' ? palmersZinnia :
             plant.plant_name === 'Parry\'s Lipfern' ? parrysLipfern :
             plant.plant_name === 'Prairie Bishop' ? prairieBishop :
             plant.plant_name === 'Prinkava\'s Prickleypear' ? prinkavasPrickleypear :
             plant.plant_name === 'Puerto Rico Indigoberry' ? puertoRicoIndigoberry :
             plant.plant_name === 'Script Lichen' ? scriptLichen :
             plant.plant_name === 'Sedge' ? sedge :
             plant.plant_name === 'Showy Draba' ? showyDraba :
             plant.plant_name === 'Sonoran Water-willow' ? sonoranWaterwillow :
             plant.plant_name === 'Spotless Balm' ? spotlessBalm :
             plant.plant_name === 'Staghorn Clubmoss' ? staghornClubmoss :
             plant.plant_name === 'Streambank Cyanea' ? streambankCyanea :
             plant.plant_name === 'Szechuan White Birch' ? szechuanWhiteBirch :
             plant.plant_name === 'Tropical False Goldeneye' ? tropicalFalseGoldeneye :
             plant.plant_name === 'Umbrella Indian Mallow' ? umbrellaIndianMallow :
             plant.plant_name === 'Waioli Valley Maiden Fern' ? waioliValleyMaidenFern :
             plant.plant_name === 'Walpole\'s Poppy' ? walpolesPoppy :
             plant.plant_name === 'Willow Cyanea' ? willowCyanea :
             plant.plant_name === 'Winged Wattle' ? wingedWattle :
             plant.plant_name === 'Wood Lily' ? woodLily :
             plant.plant_name === 'Yellow Coralroot' ? yellowCoralroot :
             plant.plant_name === 'Yellow Pond-lily' ? yellowPondlily :
             plant.plant_name === 'Sunflower' ? sunflowerImg :
             plant.plant_name === 'Tulip' ? tulipImg :
             plant.category === 'Vegetable' ? hobartFarmImg :
             plant.category === 'Fruits' ? osoberryImg :
             plant.category === 'Flower' ? nooktaRoseImg : 
             peasImg,
        alt: plant.plant_name,
        caption: `${plant.plant_name} - ${plant.category} (${plant.difficulty})`,
        onClick: () => setPopupInfo(plant)
      }));

    // If we don't have enough recommendations, pad with default items
    while (recommendedPlants.length < 3) {
      recommendedPlants.push({
        src: peasImg,
        alt: 'Default Plant',
        caption: 'Save more plants to get better recommendations!'
      });
    }

    return recommendedPlants;
  };

  const recommended = getRecommendedPlants();

  const isFiltering = (selectedCategory || 
                     Object.values(filters.maintenance).some(v => v) || 
                     Object.values(filters.category).some(v => v)) && 
                     filteredPlants.length > 0;

  // Check if there are more results to load
  const hasMoreResults = filteredPlants.length > 0 
    ? displayedPlants.length < filteredPlants.length 
    : displayedPlants.length < plantsData.length;

  const buttonStyles = {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    backgroundColor: '#205624',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#1e401f',
      transform: 'translateY(-2px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }
  };

  const handleAddToMyPlants = (plant) => {
    // Check if plant is already in myPlants before adding
    const plantImage = 
      plant.plant_name === 'Glossy Buckthorn' ? glossyBuckthorn :
      plant.plant_name === 'Golden Shower' ? goldenShower :
      plant.plant_name === 'Loquat' ? loquat :
      plant.plant_name === 'Apocynum' ? apocynum :
      plant.plant_name === 'Bahama Maidenbush' ? bahamaMaidenbush :
      plant.plant_name === 'Bouchea' ? bouchea :
      plant.plant_name === 'Bouchetia' ? bouchetia :
      plant.plant_name === 'Broadleaf False Carrot' ? broadleafFalseCarrot :
      plant.plant_name === 'Calamint' ? calamint :
      plant.plant_name === 'Chelsau' ? chelsau :
      plant.plant_name === 'Chisos Mountain Pricklypear' ? chisosMountainPricklypear :
      plant.plant_name === 'Costus' ? costus :
      plant.plant_name === 'Cup Lichen' ? cupLichen :
      plant.plant_name === 'Diplotomma Lichen' ? diplotommaLichen :
      plant.plant_name === 'Duchesne River Twinpod' ? duchesneRiverTwinpod :
      plant.plant_name === 'Dudley\'s Swordfern' ? dudleysSwordfern :
      plant.plant_name === 'Dwarf Umbrella-sedge' ? dwarfUmbrellasedge :
      plant.plant_name === 'Eastern Fournerved Daisy' ? easternFournervedDaisy :
      plant.plant_name === 'Few-flower Fumitory' ? fewflowerFumitory :
      plant.plant_name === 'Greenspot Nightshade' ? greenspotNightshade :
      plant.plant_name === 'Hairyseed Paspalum' ? hairyseedPaspalum :
      plant.plant_name === 'Hoary Tansyaster' ? hoaryTansyaster :
      plant.plant_name === 'Indusiella Moss' ? indusiellaMoss :
      plant.plant_name === 'Janusia' ? janusia :
      plant.plant_name === 'Jau Jau' ? jauJau :
      plant.plant_name === 'Johnston\'s Phlox' ? johnstonsPhlox :
      plant.plant_name === 'Junghuhn\'s Sphagnum' ? junghuhnsSphagnum :
      plant.plant_name === 'Melaspilea Lichen' ? melaspileaLichen :
      plant.plant_name === 'Northern Wildrice' ? northernWildrice :
      plant.plant_name === 'Palmer\'s Zinnia' ? palmersZinnia :
      plant.plant_name === 'Parry\'s Lipfern' ? parrysLipfern :
      plant.plant_name === 'Prairie Bishop' ? prairieBishop :
      plant.plant_name === 'Prinkava\'s Prickleypear' ? prinkavasPrickleypear :
      plant.plant_name === 'Puerto Rico Indigoberry' ? puertoRicoIndigoberry :
      plant.plant_name === 'Script Lichen' ? scriptLichen :
      plant.plant_name === 'Sedge' ? sedge :
      plant.plant_name === 'Showy Draba' ? showyDraba :
      plant.plant_name === 'Sonoran Water-willow' ? sonoranWaterwillow :
      plant.plant_name === 'Spotless Balm' ? spotlessBalm :
      plant.plant_name === 'Staghorn Clubmoss' ? staghornClubmoss :
      plant.plant_name === 'Streambank Cyanea' ? streambankCyanea :
      plant.plant_name === 'Szechuan White Birch' ? szechuanWhiteBirch :
      plant.plant_name === 'Tropical False Goldeneye' ? tropicalFalseGoldeneye :
      plant.plant_name === 'Umbrella Indian Mallow' ? umbrellaIndianMallow :
      plant.plant_name === 'Waioli Valley Maiden Fern' ? waioliValleyMaidenFern :
      plant.plant_name === 'Walpole\'s Poppy' ? walpolesPoppy :
      plant.plant_name === 'Willow Cyanea' ? willowCyanea :
      plant.plant_name === 'Winged Wattle' ? wingedWattle :
      plant.plant_name === 'Wood Lily' ? woodLily :
      plant.plant_name === 'Yellow Coralroot' ? yellowCoralroot :
      plant.plant_name === 'Yellow Pond-lily' ? yellowPondlily :
      plant.plant_name === 'Sunflower' ? sunflowerImg :
      plant.plant_name === 'Tulip' ? tulipImg :
      plant.category === 'Vegetable' ? hobartFarmImg :
      plant.category === 'Fruits' ? osoberryImg :
      plant.category === 'Flower' ? nooktaRoseImg : 
      peasImg;

    const plantToAdd = {
      id: Date.now() + Math.random(),
      name: plant.plant_name,
      species: plant.category.toUpperCase(),
      image: plantImage,
      type: plant.category,
      soilMoisture: 50,
      sunExposure: 50,
      overallHealth: 'Good',
      notes: '',
      waterFrequency: 'weekly',
      lightRequirement: 'partial shade'
    };

    // Add the plant and navigate only if successfully added
    addPlants([plantToAdd]);
    navigate('/home');
  };

  return (
    <>
      <NavBar />

      <div className="recommend-page-container">
        {/* Add search bar only when viewing all plants or when filters are active */}
        {(isViewingAll || isFiltering) && !isViewingSaved && (
          <div className="search-container-filter">
            <form onSubmit={(e) => {
              e.preventDefault();
              const searchInput = e.target.elements.searchInput;
              const searchTerm = searchInput.value.trim();
              handleSearch(searchTerm);
            }}>
              <input
                type="text"
                name="searchInput"
                placeholder="Search plants..."
                className="search-input-filter"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </form>
          </div>
        )}
        <div className="desktop-layout">
          {/* Filter Sidebar */}
          <div className="filter-sidebar">
            {/* View All Plants button */}
            <button 
              className="view-all-button"
              onClick={() => {
                if (isViewingAll) {
                  // Return to home view
                  setIsViewingAll(false);
                  setIsViewingSaved(false);
                  setFilteredPlants([]);
                  setDisplayedPlants(plantsData.slice(0, 6));
                  setCurrentPage(1);
                } else {
                  // Show all plants view
                  setFilters({
                    maintenance: {
                      easy: false,
                      medium: false,
                      hard: false
                    },
                    category: {
                      fruits: false,
                      vegetables: false,
                      flowers: false
                    }
                  });
                  setSelectedCategory(null);
                  setFilteredPlants(plantsData);
                  setDisplayedPlants(plantsData.slice(0, 6));
                  setCurrentPage(1);
                  setIsViewingAll(true);
                  setIsViewingSaved(false);
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1e401f';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#205624';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#205624',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
            >
              {isViewingAll ? 'Return to Home' : 'View All Plants'}
            </button>

            {/* View Saved Plants button */}
            <button 
              className="view-saved-button"
              onClick={() => {
                if (isViewingSaved) {
                  // Return to home view
                  setIsViewingSaved(false);
                  setIsViewingAll(false);
                  setFilteredPlants([]);
                  setDisplayedPlants(plantsData.slice(0, 6));
                  setCurrentPage(1);
                } else {
                  // Show saved plants view
                  setFilters({
                    maintenance: {
                      easy: false,
                      medium: false,
                      hard: false
                    },
                    category: {
                      fruits: false,
                      vegetables: false,
                      flowers: false
                    }
                  });
                  setSelectedCategory(null);
                  setFilteredPlants(savedPlants);
                  setDisplayedPlants(savedPlants.slice(0, 6));
                  setCurrentPage(1);
                  setIsViewingSaved(true);
                  setIsViewingAll(false);
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1e401f';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#205624';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '20px',
                backgroundColor: '#205624',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
            >
              {isViewingSaved ? 'Return to Home' : 'View Saved Plants'}
            </button>

            <div className="filter-section">
              <h3>Category</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={filters.category.fruits}
                    onChange={() => handleFilterChange('category', 'fruits')}
                  />
                  Fruits
                </label>
                <label className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={filters.category.vegetables}
                    onChange={() => handleFilterChange('category', 'vegetables')}
                  />
                  Vegetables
                </label>
                <label className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={filters.category.flowers}
                    onChange={() => handleFilterChange('category', 'flowers')}
                  />
                  Flowers
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h3>Maintenance Levels</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={filters.maintenance.easy}
                    onChange={() => handleFilterChange('maintenance', 'easy')}
                  />
                  Easy
                </label>
                <label className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={filters.maintenance.medium}
                    onChange={() => handleFilterChange('maintenance', 'medium')}
                  />
                  Medium
                </label>
                <label className="filter-option">
                  <input 
                    type="checkbox" 
                    checked={filters.maintenance.hard}
                    onChange={() => handleFilterChange('maintenance', 'hard')}
                  />
                  Hard
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="main-content">
            {(isFiltering || isViewingAll || isViewingSaved) ? (
              <>
                <h2 className="results-header" style={{ color: '#205624' }}>
                  {isViewingAll ? 'All Plants' : 
                   isViewingSaved ? 'Saved Plants' :
                   (selectedCategory || 'Search Results')}
                  {leafIcon && <img src={leafIcon} alt="Plant icon" style={{ marginLeft: '8px' }} />}
                </h2>
                <div className="plants-section">
                  <div className="section">
                    {displayedPlants.length > 0 ? displayedPlants.map((plant, idx) => (
                      <div className="plant-card" key={idx}>
                        <img 
                          src={
                            plant.plant_name === 'Glossy Buckthorn' ? glossyBuckthorn :
                            plant.plant_name === 'Golden Shower' ? goldenShower :
                            plant.plant_name === 'Loquat' ? loquat :
                            plant.plant_name === 'Apocynum' ? apocynum :
                            plant.plant_name === 'Bahama Maidenbush' ? bahamaMaidenbush :
                            plant.plant_name === 'Bouchea' ? bouchea :
                            plant.plant_name === 'Bouchetia' ? bouchetia :
                            plant.plant_name === 'Broadleaf False Carrot' ? broadleafFalseCarrot :
                            plant.plant_name === 'Calamint' ? calamint :
                            plant.plant_name === 'Chelsau' ? chelsau :
                            plant.plant_name === 'Chisos Mountain Pricklypear' ? chisosMountainPricklypear :
                            plant.plant_name === 'Costus' ? costus :
                            plant.plant_name === 'Cup Lichen' ? cupLichen :
                            plant.plant_name === 'Diplotomma Lichen' ? diplotommaLichen :
                            plant.plant_name === 'Duchesne River Twinpod' ? duchesneRiverTwinpod :
                            plant.plant_name === 'Dudley\'s Swordfern' ? dudleysSwordfern :
                            plant.plant_name === 'Dwarf Umbrella-sedge' ? dwarfUmbrellasedge :
                            plant.plant_name === 'Eastern Fournerved Daisy' ? easternFournervedDaisy :
                            plant.plant_name === 'Few-flower Fumitory' ? fewflowerFumitory :
                            plant.plant_name === 'Greenspot Nightshade' ? greenspotNightshade :
                            plant.plant_name === 'Hairyseed Paspalum' ? hairyseedPaspalum :
                            plant.plant_name === 'Hoary Tansyaster' ? hoaryTansyaster :
                            plant.plant_name === 'Indusiella Moss' ? indusiellaMoss :
                            plant.plant_name === 'Janusia' ? janusia :
                            plant.plant_name === 'Jau Jau' ? jauJau :
                            plant.plant_name === 'Johnston\'s Phlox' ? johnstonsPhlox :
                            plant.plant_name === 'Junghuhn\'s Sphagnum' ? junghuhnsSphagnum :
                            plant.plant_name === 'Melaspilea Lichen' ? melaspileaLichen :
                            plant.plant_name === 'Northern Wildrice' ? northernWildrice :
                            plant.plant_name === 'Palmer\'s Zinnia' ? palmersZinnia :
                            plant.plant_name === 'Parry\'s Lipfern' ? parrysLipfern :
                            plant.plant_name === 'Prairie Bishop' ? prairieBishop :
                            plant.plant_name === 'Prinkava\'s Prickleypear' ? prinkavasPrickleypear :
                            plant.plant_name === 'Puerto Rico Indigoberry' ? puertoRicoIndigoberry :
                            plant.plant_name === 'Script Lichen' ? scriptLichen :
                            plant.plant_name === 'Sedge' ? sedge :
                            plant.plant_name === 'Showy Draba' ? showyDraba :
                            plant.plant_name === 'Sonoran Water-willow' ? sonoranWaterwillow :
                            plant.plant_name === 'Spotless Balm' ? spotlessBalm :
                            plant.plant_name === 'Staghorn Clubmoss' ? staghornClubmoss :
                            plant.plant_name === 'Streambank Cyanea' ? streambankCyanea :
                            plant.plant_name === 'Szechuan White Birch' ? szechuanWhiteBirch :
                            plant.plant_name === 'Tropical False Goldeneye' ? tropicalFalseGoldeneye :
                            plant.plant_name === 'Umbrella Indian Mallow' ? umbrellaIndianMallow :
                            plant.plant_name === 'Waioli Valley Maiden Fern' ? waioliValleyMaidenFern :
                            plant.plant_name === 'Walpole\'s Poppy' ? walpolesPoppy :
                            plant.plant_name === 'Willow Cyanea' ? willowCyanea :
                            plant.plant_name === 'Winged Wattle' ? wingedWattle :
                            plant.plant_name === 'Wood Lily' ? woodLily :
                            plant.plant_name === 'Yellow Coralroot' ? yellowCoralroot :
                            plant.plant_name === 'Yellow Pond-lily' ? yellowPondlily :
                            plant.plant_name === 'Sunflower' ? sunflowerImg :
                            plant.plant_name === 'Tulip' ? tulipImg :
                            plant.category === 'Vegetable' ? hobartFarmImg :
                            plant.category === 'Fruits' ? osoberryImg :
                            plant.category === 'Flower' ? nooktaRoseImg : 
                            peasImg
                          } 
                          alt={plant.plant_name} 
                          className="plant-image"
                        />
                        <div className="plant-details">
                          <div className="plant-name-container">
                            <h3>{plant.plant_name}</h3>
                            <button 
                              className={`star-icon ${plant.isSaved ? 'saved' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSavePlant(plant, plant.isSaved);
                              }}
                              aria-label={plant.isSaved ? "Unsave plant" : "Save plant"}
                            >
                              ★
                            </button>
                          </div>
                          <p><strong>Location:</strong> {plant.zipcode || '98105'}</p>
                          <p><strong>Difficulty:</strong> {plant.difficulty}</p>
                          <p><strong>Category:</strong> {plant.category}</p>
                          
                          {/* Add to My Plants button - only show in saved plants view */}
                          {isViewingSaved && (
                            <button
                              className="add-plants-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToMyPlants(plant);
                              }}
                              style={{
                                width: '100%',
                                marginTop: '10px',
                                padding: '8px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease',
                                fontSize: '0.9rem'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#45a049';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#4CAF50';
                              }}
                            >
                              Add to My Plants
                            </button>
                          )}
                        </div>
                      </div>
                    )) : (
                      <figure className="item">
                        {isViewingSaved ? (
                          <div style={{ textAlign: 'center', padding: '20px' }}>
                            <h3 style={{ color: '#205624', marginBottom: '10px' }}>No saved plants</h3>
                            <p style={{ color: '#666' }}>Star some plants to save them for later!</p>
                          </div>
                        ) : (
                          <>
                            <img src={peasImg} alt="No plants found" />
                            <figcaption>No plants match your filters</figcaption>
                          </>
                        )}
                      </figure>
                    )}
                  </div>
                  
                  {hasMoreResults && !isViewingSaved && (
                    <div className="load-more-container">
                      <button 
                        className="load-more-button" 
                        onClick={handleLoadMore}
                      >
                        Load More Results
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Section
                  title="Top Picks of the Season (Summer)"
                  items={topPicks}
                />
                <Section
                  title="Recommended For You"
                  items={getRecommendedPlants()}
                  icon={leafIcon}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Location Popup */}
      {popupInfo && (
        <div className="location-popup-overlay" onClick={() => setPopupInfo(null)}>
          <div className="location-popup popup-with-image" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-popup" 
              onClick={() => setPopupInfo(null)}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: 3,
                padding: '5px 10px'
              }}
            >×</button>
            <div className="popup-content" style={{ marginTop: '20px' }}>
              <div className="popup-text">
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, paddingRight: '40px', lineHeight: '1.4' }}>{popupInfo.plant_name}</h3>
                  <button 
                    className={`star-icon ${popupInfo.isSaved ? 'saved' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSavePlant(popupInfo, popupInfo.isSaved);
                    }}
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '10px',
                      fontSize: '24px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: popupInfo.isSaved ? '#FFD700' : '#ccc',
                      transition: 'color 0.2s ease',
                      padding: '0 8px',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    aria-label={popupInfo.isSaved ? "Unsave plant" : "Save plant"}
                  >
                    ★
                  </button>
                </div>
                <p><strong>Native Location:</strong> {popupInfo.location}</p>
                <p><strong>Zipcode:</strong> {popupInfo.zipcode || '98105'}</p>
                <p><strong>Difficulty:</strong> {popupInfo.difficulty}</p>
                <p><strong>Category:</strong> {popupInfo.category}</p>
              </div>
              <div className="popup-image" style={{ position: 'relative' }}>
                <img 
                  src={
                    popupInfo.plant_name === 'Glossy Buckthorn' ? glossyBuckthorn :
                    popupInfo.plant_name === 'Golden Shower' ? goldenShower :
                    popupInfo.plant_name === 'Loquat' ? loquat :
                    popupInfo.plant_name === 'Apocynum' ? apocynum :
                    popupInfo.plant_name === 'Bahama Maidenbush' ? bahamaMaidenbush :
                    popupInfo.plant_name === 'Bouchea' ? bouchea :
                    popupInfo.plant_name === 'Bouchetia' ? bouchetia :
                    popupInfo.plant_name === 'Broadleaf False Carrot' ? broadleafFalseCarrot :
                    popupInfo.plant_name === 'Calamint' ? calamint :
                    popupInfo.plant_name === 'Chelsau' ? chelsau :
                    popupInfo.plant_name === 'Chisos Mountain Pricklypear' ? chisosMountainPricklypear :
                    popupInfo.plant_name === 'Costus' ? costus :
                    popupInfo.plant_name === 'Cup Lichen' ? cupLichen :
                    popupInfo.plant_name === 'Diplotomma Lichen' ? diplotommaLichen :
                    popupInfo.plant_name === 'Duchesne River Twinpod' ? duchesneRiverTwinpod :
                    popupInfo.plant_name === 'Dudley\'s Swordfern' ? dudleysSwordfern :
                    popupInfo.plant_name === 'Dwarf Umbrella-sedge' ? dwarfUmbrellasedge :
                    popupInfo.plant_name === 'Eastern Fournerved Daisy' ? easternFournervedDaisy :
                    popupInfo.plant_name === 'Few-flower Fumitory' ? fewflowerFumitory :
                    popupInfo.plant_name === 'Greenspot Nightshade' ? greenspotNightshade :
                    popupInfo.plant_name === 'Hairyseed Paspalum' ? hairyseedPaspalum :
                    popupInfo.plant_name === 'Hoary Tansyaster' ? hoaryTansyaster :
                    popupInfo.plant_name === 'Indusiella Moss' ? indusiellaMoss :
                    popupInfo.plant_name === 'Janusia' ? janusia :
                    popupInfo.plant_name === 'Jau Jau' ? jauJau :
                    popupInfo.plant_name === 'Johnston\'s Phlox' ? johnstonsPhlox :
                    popupInfo.plant_name === 'Junghuhn\'s Sphagnum' ? junghuhnsSphagnum :
                    popupInfo.plant_name === 'Melaspilea Lichen' ? melaspileaLichen :
                    popupInfo.plant_name === 'Northern Wildrice' ? northernWildrice :
                    popupInfo.plant_name === 'Palmer\'s Zinnia' ? palmersZinnia :
                    popupInfo.plant_name === 'Parry\'s Lipfern' ? parrysLipfern :
                    popupInfo.plant_name === 'Prairie Bishop' ? prairieBishop :
                    popupInfo.plant_name === 'Prinkava\'s Prickleypear' ? prinkavasPrickleypear :
                    popupInfo.plant_name === 'Puerto Rico Indigoberry' ? puertoRicoIndigoberry :
                    popupInfo.plant_name === 'Script Lichen' ? scriptLichen :
                    popupInfo.plant_name === 'Sedge' ? sedge :
                    popupInfo.plant_name === 'Showy Draba' ? showyDraba :
                    popupInfo.plant_name === 'Sonoran Water-willow' ? sonoranWaterwillow :
                    popupInfo.plant_name === 'Spotless Balm' ? spotlessBalm :
                    popupInfo.plant_name === 'Staghorn Clubmoss' ? staghornClubmoss :
                    popupInfo.plant_name === 'Streambank Cyanea' ? streambankCyanea :
                    popupInfo.plant_name === 'Szechuan White Birch' ? szechuanWhiteBirch :
                    popupInfo.plant_name === 'Tropical False Goldeneye' ? tropicalFalseGoldeneye :
                    popupInfo.plant_name === 'Umbrella Indian Mallow' ? umbrellaIndianMallow :
                    popupInfo.plant_name === 'Waioli Valley Maiden Fern' ? waioliValleyMaidenFern :
                    popupInfo.plant_name === 'Walpole\'s Poppy' ? walpolesPoppy :
                    popupInfo.plant_name === 'Willow Cyanea' ? willowCyanea :
                    popupInfo.plant_name === 'Winged Wattle' ? wingedWattle :
                    popupInfo.plant_name === 'Wood Lily' ? woodLily :
                    popupInfo.plant_name === 'Yellow Coralroot' ? yellowCoralroot :
                    popupInfo.plant_name === 'Yellow Pond-lily' ? yellowPondlily :
                    popupInfo.plant_name === 'Sunflower' ? sunflowerImg :
                    popupInfo.plant_name === 'Tulip' ? tulipImg :
                    popupInfo.plant_name === 'Tomato' ? hobartFarmImg :
                    popupInfo.category === 'Vegetable' ? hobartFarmImg :
                    popupInfo.category === 'Fruits' ? osoberryImg :
                    popupInfo.category === 'Flower' ? nooktaRoseImg : 
                    peasImg
                  } 
                  alt={popupInfo.plant_name}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}