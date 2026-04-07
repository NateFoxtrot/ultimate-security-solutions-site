const partnersData = [
    {
        "name": "Target Corporation",
        "logo": "assets/images/partners/target.svg",
        "rating": 5,
        "review": "Successful execution of multi-day infrastructure upgrades and structured cabling deployments using specialized aerial equipment."
    },
    {
        "name": "Walmart Inc.",
        "logo": "assets/images/partners/walmart.svg",
        "rating": 5,
        "review": "Professional NCR KDS Touch Screen replacements and POS system maintenance."
    },
    {
        "name": "Aruba Networks",
        "logo": "assets/images/partners/aruba.svg",
        "rating": 5,
        "review": "Managed replacement of enterprise Aruba Access Points to restore high-performance wireless coverage."
    },
    {
        "name": "AT&T Inc.",
        "logo": "assets/images/partners/atandt.svg",
        "rating": 5,
        "review": "Deployment and maintenance of telecommunications equipment and 5G infrastructure."
    },
    {
        "name": "Cisco Systems",
        "logo": "assets/images/partners/cisco.svg",
        "rating": 5,
        "review": "Complex network infrastructure upgrades and high-security environment cabling."
    },
    {
        "name": "FedEx Corporation",
        "logo": "assets/images/partners/fedex.svg",
        "rating": 5,
        "review": "Reliable network infrastructure support and critical kiosk maintenance for logistics operations."
    },
    {
        "name": "Verizon Wireless",
        "logo": "assets/images/partners/verizon.svg",
        "rating": 5,
        "review": "Expert support for telecommunications equipment and critical network deployments."
    },
    {
        "name": "Starlink (SpaceX)",
        "logo": "assets/images/partners/starlink.svg",
        "rating": 5,
        "review": "Professional installation of Starlink satellite terminals for reliable remote connectivity."
    },
    {
        "name": "The Home Depot",
        "logo": "assets/images/partners/homedepot.svg",
        "rating": 5,
        "review": "IT infrastructure upgrades and structured cabling for retail floor operations."
    },
    {
        "name": "Hikvision Digital Technology",
        "logo": "assets/images/partners/hikvision.svg",
        "rating": 5,
        "review": "Expert configuration of Hikvision CCTV arrays for comprehensive commercial surveillance."
    },
    {
        "name": "Honeywell International",
        "logo": "assets/images/partners/honeywell.svg",
        "rating": 5,
        "review": "Installation and maintenance of Honeywell intrusion detection and security systems."
    },
    {
        "name": "LT Security Inc.",
        "logo": "assets/images/partners/lts.svg",
        "rating": 5,
        "review": "Preferred partner for LTS Platinum and Pro-X video security solutions."
    },
    {
        "name": "Sierra Wireless (Semtech)",
        "logo": "assets/images/partners/sierrawireless.svg",
        "rating": 5,
        "review": "Specialized deployment of cellular failover and wireless networking hardware."
    },
    {
        "name": "Bosch Security Systems",
        "logo": "assets/images/partners/bosch.svg",
        "rating": 5,
        "review": "Authorized installer of high-performance Bosch security systems."
    },
    {
        "name": "Ubiquiti Inc.",
        "logo": "assets/images/partners/ubiquiti.svg",
        "rating": 5,
        "review": "Strategic deployment of UniFi networking and wireless infrastructure."
    },
    {
        "name": "Walgreens Co.",
        "logo": "assets/images/partners/walgreens.svg",
        "rating": 5,
        "review": "Network upgrades and pharmacy system cabling projects."
    },
    {
        "name": "Pilot Flying J",
        "logo": "assets/images/partners/pilot.svg",
        "rating": 5,
        "review": "Supporting critical fuel desk and retail network systems across the midwest."
    },
    {
        "name": "Ameristar Casino Hotel",
        "logo": "assets/images/partners/ameristar.svg",
        "rating": 5,
        "review": "Ensuring 24/7 uptime for gaming floor security and surveillance networks."
    },
    {
        "name": "Cradlepoint, Inc.",
        "logo": "assets/images/partners/cradlepoint.svg",
        "rating": 5,
        "review": "Advanced LTE/5G wireless edge solutions for mission-critical connectivity."
    },
    {
        "name": "Fortinet, Inc.",
        "logo": "assets/images/partners/fortinet.svg",
        "rating": 5,
        "review": "Comprehensive cybersecurity and network security infrastructure deployments."
    },
    {
        "name": "Hanwha Vision",
        "logo": "assets/images/partners/hanwha.svg",
        "rating": 5,
        "review": "Strategic implementation of Hanwha Techwin surveillance technology."
    },
    {
        "name": "Hy-Vee, Inc.",
        "logo": "assets/images/partners/hy-vee.svg",
        "rating": 5,
        "review": "Reliable retail system support and infrastructure maintenance."
    },
    {
        "name": "The Kroger Co.",
        "logo": "assets/images/partners/kroger.svg",
        "rating": 5,
        "review": "Nationwide POS and networking infrastructure rollouts."
    },
    {
        "name": "Love's Travel Stops",
        "logo": "assets/images/partners/loves.svg",
        "rating": 5,
        "review": "High-priority infrastructure and fuel desk networking support."
    },
    {
        "name": "QuikTrip Corporation",
        "logo": "assets/images/partners/quiktrip.svg",
        "rating": 5,
        "review": "Critical retail system upgrades and reliable smart-hands service."
    },
    {
        "name": "Spectrum (Charter Communications)",
        "logo": "assets/images/partners/spectrum.svg",
        "rating": 5,
        "review": "Strategic partner for commercial connectivity and telecommunications infrastructure."
    },
    {
        "name": "T-Mobile US",
        "logo": "assets/images/partners/t-mobile.svg",
        "rating": 5,
        "review": "Elite wireless infrastructure and 5G network support."
    },
    {
        "name": "Granite Telecommunications",
        "logo": "assets/images/partners/granite.svg",
        "rating": 5,
        "review": "Reliable regional infrastructure support and managed network services."
    },
    {
        "name": "Checkpoint Systems, Inc.",
        "logo": "assets/images/partners/checkpoint.svg",
        "rating": 5,
        "review": "Installation and calibration of Electronic Article Surveillance (EAS) and loss prevention systems."
    },
    {
        "name": "PlayNetwork, Inc.",
        "logo": "assets/images/partners/playnetwork.svg",
        "rating": 5,
        "review": "Deployment of professional AV and multimedia content delivery systems for commercial spaces."
    },
    {
        "name": "ASSA ABLOY Group",
        "logo": "assets/images/partners/assaabloy.svg",
        "rating": 5,
        "review": "Expert installation of advanced door opening solutions and electronic access control hardware."
    },
    {
        "name": "Best Buy Co., Inc.",
        "logo": "assets/images/partners/bestbuy.svg",
        "rating": 5,
        "review": "Managed technical services and regional IT infrastructure support for retail operations."
    },
    {
        "name": "Apple Inc.",
        "logo": "assets/images/partners/apple.svg",
        "rating": 5,
        "review": "High-standard network infrastructure support and specialized device deployments."
    },
    {
        "name": "Dollar General Corporation",
        "logo": "assets/images/partners/dollargeneral.svg",
        "rating": 5,
        "review": "Nationwide rollout support for networking, security, and POS system maintenance."
    }
];