import urbanFeed from '../../src/assets/img/urban-feed.jpg';
import hobartFarms from '../../src/assets/img/hobart-farm.jpg';
import wellsMedina from '../../src/assets/img/wells-medina.jpg';
import woodBrook from '../../src/assets/img/woodBrook.jpg';
import goNatives from '../../src/assets/img/gonative.jpg';
const shopsData = [
    {
      id: 1,
      name: "Hobart Farms Nursery",
      address: "26514 SE 216th St, Maple Valley, WA 98038",
      description: "A local favorite for organic seeds, gardening supplies, and friendly expert advice. They often host workshops for the community.",
      imageUrl: hobartFarms,
      websiteUrl: 'https://hobartfarmsnursery.com/'
    },
    {
      id: 2,
      name: "Wells Medina Nursery",
      address: "8300 NE 24th St, Medina, WA 98039",
      description: "Your go-to for unique plants and gardening tools. Expert staff always ready to help.",
      imageUrl: wellsMedina,
      websiteUrl: 'https://wellsmedinanursery.com/'
    },
    {
      id: 3,
      name: "Woodbrook Native Plant Nursery",
      address: "5919 78th Ave NW, Gig Harbor, WA 98335",
      description: "Gardening resource specializing in plants native to the Pacific NW, plus equipment & landscaping.",
      imageUrl: woodBrook,
      lat: 47.6101, lng: -122.3385
    },
    {
      id: 4,
      name: "Urban Feed & Garden",
      address: "4878 Beacon Ave S, Seattle, WA 98108",
      description: "Local garden center with native plants, chickens & high-quality pet supplies, plus classes & events.",
      imageUrl: urbanFeed,
      websiteUrl: 'https://www.urbanfeedandgarden.com/'
    },
    {
      id: 5,
      name: "Go Natives! Nursery",
      address: "2112 NW 199th St, Shoreline, WA 98177",
      description: "Premium gardening supplies and a vast selection of evergreen trees.",
      imageUrl: goNatives,
      websiteUrl: 'https://gonativesnursery.com/'
    },
  ];
  
  export default shopsData;