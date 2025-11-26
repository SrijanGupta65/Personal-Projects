import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { usePlants } from '../context/PlantContext';

// Import all plant images
import douglasFirImg from '../assets/img/douglas-fir.png';
import redFloweringCurrantImg from '../assets/img/red-flowering-currant.jpg';
import pacificRhododendronImg from '../assets/img/pacific-rhododendron.jpg';
import commonCamasImg from '../assets/img/common-camas.jpg';
import salalImg from '../assets/img/salal.jpeg';
import oceansprayImg from '../assets/img/oceanspray.jpg';
import vineMapleImg from '../assets/img/vine-maple.png';
import swordFernImg from '../assets/img/sword-fern.png';
import snowberryImg from '../assets/img/snowberry.jpg';
import nootkaRoseImg from '../assets/img/nookta-rose.png';
import pacificDogwoodImg from '../assets/img/pacific-dogwood.png';
import serviceberryImg from '../assets/img/serviceberry.png';
import westernRedCedarImg from '../assets/img/western_red_cedar.jpg';
import pacificMadroneImg from '../assets/img/pacific-madrone.jpeg';
import oregonGrapeImg from '../assets/img/oregon-grape.jpg';
import redElderberryImg from '../assets/img/red-elderberry.jpg';
import indianPlumImg from '../assets/img/indian-plum.jpg';
import pacificNinebarkImg from '../assets/img/pacific-ninebark.jpg';
import redAlderImg from '../assets/img/red-alder.jpg';
import westernHemlockImg from '../assets/img/western-hemlock.jpeg';
import pacificYewImg from '../assets/img/pacific-yew.jpg';
import bigleafMapleImg from '../assets/img/bigleaf-maple.jpg';
import thimbleberryImg from '../assets/img/thimbleberry.jpeg';
import pacificBleedingHeartImg from '../assets/img/pacific-bleeding-heart.jpg';
import evergreenHuckleberryImg from '../assets/img/evergreen-huckleberry.jpg';
import deerFernImg from '../assets/img/deer-fern.jpg';
import pacificTrilliumImg from '../assets/img/pacific-trillium.jpeg';
import twinflowerImg from '../assets/img/twinflower.jpg';
import redColumbineImg from '../assets/img/red-columbine.jpg';
import maidenhairFernImg from '../assets/img/maidenhair-fern.jpg';
import sitkaSprucerImg from '../assets/img/sitka-spruce.jpg';

// Create a mapping of plant images
const plantImages = {
  'Douglas Fir': douglasFirImg,
  'Red-flowering currant': redFloweringCurrantImg,
  'Pacific rhododendron': pacificRhododendronImg,
  'Common camas': commonCamasImg,
  'Salal': salalImg,
  'Oceanspray': oceansprayImg,
  'Vine maple': vineMapleImg,
  'Sword Fern': swordFernImg,
  'Snowberry': snowberryImg,
  'Nootka Rose': nootkaRoseImg,
  'Pacific dogwood': pacificDogwoodImg,
  'Serviceberry': serviceberryImg,
  'Western Red Cedar': westernRedCedarImg,
  'Pacific Madrone': pacificMadroneImg,
  'Oregon Grape': oregonGrapeImg,
  'Red Elderberry': redElderberryImg,
  'Indian Plum': indianPlumImg,
  'Pacific Ninebark': pacificNinebarkImg,
  'Red Alder': redAlderImg,
  'Western Hemlock': westernHemlockImg,
  'Pacific Yew': pacificYewImg,
  'Bigleaf Maple': bigleafMapleImg,
  'Thimbleberry': thimbleberryImg,
  'Pacific Bleeding Heart': pacificBleedingHeartImg,
  'Evergreen Huckleberry': evergreenHuckleberryImg,
  'Deer Fern': deerFernImg,
  'Pacific Trillium': pacificTrilliumImg,
  'Twinflower': twinflowerImg,
  'Red Columbine': redColumbineImg,
  'Maidenhair Fern': maidenhairFernImg,
  'Sitka Spruce': sitkaSprucerImg
};

const washingtonPlants = [
    {
        name: 'Douglas Fir (Pseudotsuga menziesii)',
        type: 'Tree',
        habitat: 'Forest',
        image: douglasFirImg,
        alt: 'Douglas Fir'
    },
    {
        name: 'Red-flowering currant (Ribes sanguineum)',
        type: 'Shrub',
        habitat: 'Woodland',
        image: redFloweringCurrantImg,
        alt: 'Red-Flowering Currant'
    },
    {
        name: 'Pacific rhododendron (Rhododendron macrophyllum)',
        type: 'Shrub',
        habitat: 'Forest understory',
        image: pacificRhododendronImg,
        alt: 'Pacific Rhododendron'
    },
    {
        name: 'Common camas (Camassia quamash)',
        type: 'Flowering plant',
        habitat: 'Meadows',
        image: commonCamasImg,
        alt: 'Common Camas'
    },
    {
        name: 'Salal (Gaultheria shallon)',
        type: 'Shrub',
        habitat: 'Forest understory',
        image: salalImg,
        alt: 'Salal'
    },
    {
        name: 'Oceanspray (Holodiscus discolor)',
        type: 'Shrub',
        habitat: 'Coastal areas',
        image: oceansprayImg,
        alt: 'Oceanspray'
    },
    {
        name: 'Vine maple (Acer circinatum)',
        type: 'Tree',
        habitat: 'Forest understory',
        image: vineMapleImg,
        alt: 'Vine Maple'
    },
    {
        name: 'Sword Fern (Polystichum munitum)',
        type: 'Fern',
        habitat: 'Forest understory',
        image: swordFernImg,
        alt: 'Sword Fern'
    },
    {
        name: 'Snowberry (Symphoricarpos albus)',
        type: 'Shrub',
        habitat: 'Forest edges',
        image: snowberryImg,
        alt: 'Snowberry'
    },
    {
        name: 'Nootka Rose (Rosa nutkana)',
        type: 'Shrub',
        habitat: 'Mixed',
        image: nootkaRoseImg,
        alt: 'Nootka Rose'
    },
    {
        name: 'Pacific dogwood (Cornus nuttallii)',
        type: 'Tree',
        habitat: 'Forest',
        image: pacificDogwoodImg,
        alt: 'Pacific Dogwood'
    },
    {
        name: 'Serviceberry (Amelanchier alnifolia)',
        type: 'Shrub',
        habitat: 'Mixed',
        image: serviceberryImg,
        alt: 'Serviceberry'
    },
    {
        name: 'Western Red Cedar (Thuja plicata)',
        type: 'Tree',
        habitat: 'Forest',
        image: westernRedCedarImg,
        alt: 'Western Red Cedar'
    },
    {
        name: 'Pacific Madrone (Arbutus menziesii)',
        type: 'Tree',
        habitat: 'Coastal areas',
        image: pacificMadroneImg,
        alt: 'Pacific Madrone'
    },
    {
        name: 'Oregon Grape (Mahonia aquifolium)',
        type: 'Shrub',
        habitat: 'Forest understory',
        image: oregonGrapeImg,
        alt: 'Oregon Grape'
    },
    {
        name: 'Red Elderberry (Sambucus racemosa)',
        type: 'Shrub',
        habitat: 'Forest edges',
        image: redElderberryImg,
        alt: 'Red Elderberry'
    },
    {
        name: 'Indian Plum (Oemleria cerasiformis)',
        type: 'Shrub',
        habitat: 'Forest understory',
        image: indianPlumImg,
        alt: 'Indian Plum'
    },
    {
        name: 'Pacific Ninebark (Physocarpus capitatus)',
        type: 'Shrub',
        habitat: 'Riparian',
        image: pacificNinebarkImg,
        alt: 'Pacific Ninebark'
    },
    {
        name: 'Red Alder (Alnus rubra)',
        type: 'Tree',
        habitat: 'Riparian',
        image: redAlderImg,
        alt: 'Red Alder'
    },
    {
        name: 'Western Hemlock (Tsuga heterophylla)',
        type: 'Tree',
        habitat: 'Forest',
        image: westernHemlockImg,
        alt: 'Western Hemlock'
    },
    {
        name: 'Pacific Yew (Taxus brevifolia)',
        type: 'Tree',
        habitat: 'Forest understory',
        image: pacificYewImg,
        alt: 'Pacific Yew'
    },
    {
        name: 'Bigleaf Maple (Acer macrophyllum)',
        type: 'Tree',
        habitat: 'Forest',
        image: bigleafMapleImg,
        alt: 'Bigleaf Maple'
    },
    {
        name: 'Thimbleberry (Rubus parviflorus)',
        type: 'Shrub',
        habitat: 'Forest edges',
        image: thimbleberryImg,
        alt: 'Thimbleberry'
    },
    {
        name: 'Pacific Bleeding Heart (Dicentra formosa)',
        type: 'Flowering plant',
        habitat: 'Forest understory',
        image: pacificBleedingHeartImg,
        alt: 'Pacific Bleeding Heart'
    },
    {
        name: 'Evergreen Huckleberry (Vaccinium ovatum)',
        type: 'Shrub',
        habitat: 'Forest understory',
        image: evergreenHuckleberryImg,
        alt: 'Evergreen Huckleberry'
    },
    {
        name: 'Deer Fern (Blechnum spicant)',
        type: 'Fern',
        habitat: 'Forest understory',
        image: deerFernImg,
        alt: 'Deer Fern'
    },
    {
        name: 'Pacific Trillium (Trillium ovatum)',
        type: 'Flowering plant',
        habitat: 'Forest understory',
        image: pacificTrilliumImg,
        alt: 'Pacific Trillium'
    },
    {
        name: 'Twinflower (Linnaea borealis)',
        type: 'Flowering plant',
        habitat: 'Forest understory',
        image: twinflowerImg,
        alt: 'Twinflower'
    },
    {
        name: 'Red Columbine (Aquilegia formosa)',
        type: 'Flowering plant',
        habitat: 'Mixed',
        image: redColumbineImg,
        alt: 'Red Columbine'
    },
    {
        name: 'Maidenhair Fern (Adiantum aleuticum)',
        type: 'Fern',
        habitat: 'Forest understory',
        image: maidenhairFernImg,
        alt: 'Maidenhair Fern'
    },
    {
        name: 'Sitka Spruce (Picea sitchensis)',
        type: 'Tree',
        habitat: 'Coastal forest',
        image: sitkaSprucerImg,
        alt: 'Sitka Spruce'
    }
];

export default function CollectedPlantsPage() {
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { addPlants } = usePlants();

    const handlePlantClick = async (index) => {
        try {
            setIsLoading(true);
            setError(null);
            setSelectedPlant(washingtonPlants[index]);
        } catch (error) {
            setError('Failed to load plant details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToMyPlants = async () => {
        if (!selectedPlant) return;
        
        try {
            setIsLoading(true);
            setError(null);
            
            const plantToAdd = {
                id: Date.now(),
                name: selectedPlant.name.split(' (')[0],
                species: selectedPlant.type.toUpperCase(),
                image: selectedPlant.image,
                type: selectedPlant.type,
                soilMoisture: 50,
                sunExposure: 50,
                overallHealth: 'Good',
                notes: '',
                waterFrequency: 'weekly',
                lightRequirement: 'partial shade'
            };

            await addPlants([plantToAdd]);
            navigate('/home');
        } catch (error) {
            setError('Failed to add plant to collection. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <NavBar />
            <style>{`
                .collection-page {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .collection-header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .collection-title {
                    color: #205624;
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                }
                .collection-description {
                    color: #666;
                    font-size: 1.1rem;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .plants-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }
                .plant-card {
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transition: transform 0.2s ease;
                    cursor: pointer;
                }
                .plant-card:hover {
                    transform: translateY(-5px);
                }
                .plant-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                .plant-info {
                    padding: 15px;
                }
                .plant-name {
                    font-size: 1.2rem;
                    color: #205624;
                    margin-bottom: 5px;
                }
                .plant-type {
                    color: #666;
                    font-size: 0.9rem;
                }
                .plant-habitat {
                    color: #888;
                    font-size: 0.8rem;
                    margin-top: 5px;
                }
                .loading-spinner {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 200px;
                }
                .error-message {
                    color: #dc3545;
                    text-align: center;
                    padding: 20px;
                    background: #fff;
                    border-radius: 8px;
                    margin: 20px;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    max-width: 500px;
                    width: 90%;
                    position: relative;
                }
                .modal-close {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                }
                .modal-image {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-bottom: 15px;
                }
                .modal-title {
                    font-size: 1.5rem;
                    color: #205624;
                    margin-bottom: 10px;
                }
                .modal-info {
                    margin-bottom: 20px;
                }
                .modal-info p {
                    margin: 5px 0;
                    color: #666;
                }
                .add-button {
                    background: #205624;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background-color 0.2s ease;
                }
                .add-button:hover {
                    background: #1a451d;
                }
                .add-button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
            `}</style>
            <div className="collection-page">
                <div className="collection-header">
                    <h1 className="collection-title">Washington Native Plants</h1>
                    <p className="collection-description">
                        Discover and learn about native plants from Washington state. Click on any plant to view details and add it to your collection.
                    </p>
                </div>

                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="loading-spinner" role="status" aria-label="Loading">
                        Loading...
                    </div>
                ) : (
                    <div className="plants-grid">
                        {washingtonPlants.map((plant, index) => (
                            <div
                                key={index}
                                className="plant-card"
                                onClick={() => handlePlantClick(index)}
                                role="button"
                                tabIndex={0}
                                aria-label={`View details for ${plant.name}`}
                            >
                                <img
                                    src={plant.image}
                                    alt={plant.name}
                                    className="plant-image"
                                />
                                <div className="plant-info">
                                    <h3 className="plant-name">{plant.name}</h3>
                                    <p className="plant-type">{plant.type}</p>
                                    <p className="plant-habitat">{plant.habitat}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedPlant && (
                    <div className="modal-overlay" onClick={() => setSelectedPlant(null)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button
                                className="modal-close"
                                onClick={() => setSelectedPlant(null)}
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                            <img
                                src={selectedPlant.image}
                                alt={selectedPlant.name}
                                className="modal-image"
                            />
                            <h2 className="modal-title">{selectedPlant.name}</h2>
                            <div className="modal-info">
                                <p><strong>Type:</strong> {selectedPlant.type}</p>
                                <p><strong>Habitat:</strong> {selectedPlant.habitat}</p>
                            </div>
                            <button
                                className="add-button"
                                onClick={handleAddToMyPlants}
                                disabled={isLoading}
                                aria-label="Add plant to collection"
                            >
                                {isLoading ? 'Adding...' : 'Add to My Collection'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}