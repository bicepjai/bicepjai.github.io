---
layout: post
type: blog
comments: true
title: Machine for Machine Learning
date: 2015-05-25
categories: machine-learning
---

After completing some Machine Learning Courses (look into my time-line), I decided to build a rig myself to test out the learned algorithms and also work on some more interesting dataset. I am sure everyone who goes through this task of building a rig for Machine Learning would have come across the following blog posts

  1. Roelof Pieters [Building a Deep Learning (Dream) Machine](http://graphific.github.io/posts/building-a-deep-learning-dream-machine/)
  2. Tim Dettmers [How To Build and Use a Multi GPU System for Deep Learning](http://timdettmers.com/2014/09/21/how-to-build-and-use-a-multi-gpu-system-for-deep-learning/).

They cover various aspects of the hardware necessary for a rig based on one's requirements. During the build, I did have lot of questions and had to go through extensive research/reading through lot of forums, blogs and videos. I decided to share some knowledge on subtle things that can ease some souls going through the same process.

|Rig: KRATOS|

|![](/images/ml-rig/case-cooler-gpu.jpg){: height="360px" width="240px"}|![](/images/ml-rig/cat-rig.jpg){: height="360px" width="240px"}|![](/images/ml-rig/psu-cooler-case.jpg){: height="360px" width="240px"}|

The decision making process on what components depends on how much one can afford and how much one needs. I froze on some components since I decided to wait for some newer hardware releases. Things I had in mind when choosing components apart from price and looks were ways to keep the rig updated with latest releases both on hardware and software.


1. #### Motherboard:

   This is the most important component since we are not going to change this very often. We have to take everything apart to update this guy. I would give at-least 5 years before considering to update a motherboard on my rig. As other blogs suggests, we need as many PCIe slots as possible since this is going to host the GPUs. I had to choose between [Asus X99-E WS](https://www.asus.com/Motherboards/X99E_WS/) and [ASRock X99 WS-E EATX LGA2011-3](http://www.asrock.com/mb/Intel/X99%20WS-E10G/). Both of them had most of the specs matched, I chose the latter since that supports 128G RAM (ufff). I know thats too much RAM for any commonly used application but I wanted to keep my tool-belt updated so that I wont regret when the use-case arrives dealing with large datasets. The motherboard was fine when ordered but soon i realized, the motherboard X-Fan had the worst annoying noise on my whole water cooled rig. After going through pages of forum posts, i found out this is a very common issue, but asrock customer service did replace the fan, but little did that affect the noise. I finally got a similar (asus) fan from newegg after days of scrolling through pages and customer service emails matching the fan dimensions. Details can be found from the picture.

   |ASRock motherboard|ASRock X-Fan|ASUS motherboard Fan|
   |![](/images/ml-rig/mobo-2.jpg){: height="360px" width="320px"}|![ASRock X-Fan](/images/ml-rig/mobo-fan-1.jpg){: height="360px" width="240px"}|![ASUS motherboard Fan](/images/ml-rig/mobo-fan-2.jpg){: height="360px" width="240px"}|

   Purchased from [superbiz](http://www.superbiiz.com/detail.php?name=MB-X99WS-E)

2. #### Computer Case:

   My personal preference was to have a smaller case, rather than a large one sitting on my desk. [Corsair Carbide Series Air 540 High Airflow ATX Cube Case](http://www.corsair.com/en-us/carbide-series-air-540-high-airflow-atx-cube-case) is a popular choice for its price looks and features. amazon has good price on it and even available on prime. This does give nice segregation on the wiring, a glass box look if you want to light it up and good airflow. It can house ATX motherboards as its name suggests. I also got a dust filter which was expensive but based on my experience, it feels like blackrock city inside desktops especially if you have cats :) Another issue i had is housing a bigger power supply unit. There are pre made screw holes to house PSUs with maximum length 200mm, if you have longer PSUs, you have to make holes yourself using a drill machine which was a PITA.

   |![](/images/ml-rig/case-dust-cover.jpg){: height="360px" width="320px"}|![](/images/ml-rig/mobo-1.jpg){: height="360px" width="320px"}|![](/images/ml-rig/case-mobo-1.jpg){: height="360px" width="320px"}|

   Purchased from [amazon](https://www.amazon.com/gp/product/B00D6GINF4/ref=oh_aui_search_detailpage?ie=UTF8&psc=1) and [demcifilter](http://www.demcifilter.com/p0431/corsair-air-540-dust-filter-kit.aspx)

3. #### Power Supply:

   All the components power requirement must be taken into account before deciding to get a PSU, if there are going to be 4 graphics card, then they must be accounted along with other extra components such as lighting and cooling components. I decided to get [CORSAIR AX1500i 1500W ATX12V / EPS12V 80 PLUS Titanium Certified Full Modular Power Supply. Model CP-9020057-NA](http://www.corsair.com/en-us/ax1500i-digital-atx-power-supply-1500-watt-fully-modular-psu) and forget about concerns adding components. I do think we can make choices based on budget. Housing this PSU on the carbide case took bit of tinkering since this was over 200mm length.

   Purchased from [amazon](https://www.amazon.com/dp/B00LI7EY1K/ref=pe_825000_114212990_pe_825000_114212990_n_id)

4. #### RAM:

   Machine learning algorithms on big-data definitely needs larger ram. I decided to get [Crucial Ballistic Sport](http://www.crucial.com/usa/en/bls2k16g4d240fsb) since i got employee discount on it. There are lot of options for RAM and the prices are super volatile. I saw the price drop on this ram about 50% in a matter of 2 months after my purchase. My suggestion is to keep an eye out on [slickdeals](slickdeals.com) and get them in batches instead of getting all the RAMs together.

   |![](/images/ml-rig/ram-1.jpg){: height="360px" width="320px"}|![](/images/ml-rig/crucial-ram.jpg){: height="360px" width="320px"}|

   Purchased from [crucial](http://www.crucial.com/usa/en/bls2k16g4d240fsb)

5. #### Storage:

   The motherboard is of server class and offers lot of storage options including on-board RAID controller. I didn't use them anyways. I got Micron client SSDs (BX200 and M500) on employee discount. The case offers options to house the SSDs as arrays in the back and also in the front. Machine learning algorithms on a single machine working on terabytes of data require FLASH and forget about spinning media. It doesnt have to get fancy with enterprise hardware, client SSDs will do the job for us.

   Purchased from [crucial](http://www.crucial.com/usa/en/storage-ssd-bx200)

6. #### Processor:

   There are lot of options and [pcpartpicker](pcpartpicker.com) did help a lot in finding matching processors and motherboard. I was not concentrating on the number of cores because we are using GPUs exactly for that, but was looking for support on maximum ram (128G, who needs that) and [Intel Xeon E5-1650 V3 LGA20011V3](http://ark.intel.com/products/82765/Intel-Xeon-Processor-E5-1650-v3-15M-Cache-3_50-GHz) was only affordable server class processor that would full-fill that requirement. I had a friend working in Intel and I got employee discount (around 25%) on it.

   |![](/images/ml-rig/proces-1.jpg){: height="360px" width="320px"}|![](/images/ml-rig/mobo-cooler.jpg){: height="360px" width="360px"}|


7. #### Graphics Card:

   By the time I was working on this build, PASCAL cards were right around the corner. I didn't want to wait as there is always going to be an upgrade available and we have to learn to live around it. I needed 4 graphics card to complete the rig, but i got just one and decided to wait on the new releases. I got [EVGA GeForce GTX TITAN X 12GB HYBRID GAMING, "All in One" No Hassle Water Cooling, Just Plug and Play Graphics Card 12G-P4-1999-KR](http://www.evga.com/articles/00935/EVGA-GeForce-GTX-TITAN-X-HYBRID/) since i didn't want to deal with water cooling GPUs yet. This was perfect setup for games :) and was also VR ready. Titan X were specifically made for machine learning applications.

   |![](/images/ml-rig/gpu-1.jpg){: height="360px" width="320px"}|![](/images/ml-rig/gpu-2.jpg){: height="360px" width="360px"}|

8. #### Cooling System:

   Setting up cooling system for the rig was little harder as the available components were very selective, expensive and hard to return (anything is hard after being used to amazon prime). After a week of internet carousel, decided on [Alphacool NexXxoS Cool Answer 240 D5/UT Set CPU Water Cooler](http://www.tweaktown.com/reviews/6299/alphacool-nexxxos-cool-answer-240-d5-ut-set-cpu-water-cooler-review/index.html). This cooler fits all of my previous components which is one of the most important thing to look at when you have a smaller computer case. Also I got a more powerful water pump since i was going to use the same cooling system for my GPUs in future. This did make the system virtually noiseless with my rig sitting beside me all the time. There are not a lot of options available for vendors and be cautious when placing orders (one might end-up paying for nothing when trying to return products). When installing the cooler, be careful with the radiator that has light thin fins which are more vulnerable with human handling and as a result might affect the cooling altogether. Please plan the tubing before hand and try it out before filling the coolant. Do-not get colored coolant, they might end up developing organic matter in the water loop and it will be hell to clean them. Just distilled $H_2O$ and a Silver Coils - Antimicrobial .999 Fine Silver Strip will do the job. Still if you want fancy colors, get tubes in different colors.

   |![](/images/ml-rig/cooler-1.jpg){: height="360px" width="360px"}|![](/images/ml-rig/cooler-2.jpg){: height="360px" width="360px"}|![](/images/ml-rig/cooler-4.jpg){: height="360px" width="320px"}|![](/images/ml-rig/cooler-3.jpg){: height="360px" width="360px"}|

   Purchased from [performance-pcs](http://www.performance-pcs.com/alphacool-nexxxos-cool-answer-240-d5-ut-set.html) and [amazon](https://www.amazon.com/gp/product/B00A66HMRC/ref=od_aui_detailpages00?ie=UTF8&psc=1)


Refer [pcpartpicker](https://pcpartpicker.com/user/bicepjai/saved/#view=8HBXsY) for the list of components and it totally cost around $2500 with just one GPU. If you have questions regarding the build, leave a comment and i will try to help based on my experience.



