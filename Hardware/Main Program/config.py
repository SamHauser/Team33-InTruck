######################################
#   Purpose is for this class to control
#   the persistant config file.
#   
#   Library needed: pip install beautifulsoup4
######################################

import xml.etree.ElementTree as ET # used for creating the tree structure in the XML file
import os # used for file checking

class Config:
    _settingsFile = 'settings.xml'
    _maxTemp = None
    _minTemp = None
    _maxHum = None
    _minHum = None
    _inertiaThreshold = None
    _batteryThreshold = None
     
    def __init__(self):
        self.onLoad()
    
    def setMaxTemp(self, temp):
        self._maxTemp = temp
        self.updateConfig()
    
    def setMinTemp(self, temp):
        self._minTemp = temp
        self.updateConfig()
        
    def setMaxHum(self, hum):
        self._maxHum = hum
        self.updateConfig()
    
    def setMinHum(self, hum):
        self._minHum = hum
        self.updateConfig()

    def setInertia(self, inertia):
        self._inertiaThreshold = inertia
        self.updateConfig()
    
    def setBattery(self, battery):
        self._batteryThreshold = battery
        self.updateConfig() 

    #   onLoad loads the settings into the class, if xml file is not found it will create it with default settings
    def onLoad(self):
        if os.path.isfile(self._settingsFile):
            print('Settings file does exist')
        else:
            self.createConfig()
            print('Created Default settings.xml')
        tree = ET.parse(self._settingsFile)
        root = tree.getroot()
        for property in root.findall('property'):
            name = property.get('name')
            value = property.get('value')
            if name == '_maxTemp':
                self._maxTemp = value
            if name == '_minTemp':
                self._minTemp = value
            if name == '_maxHum':
                self._maxHum = value
            if name == '_minHum':
                self._minHum = value
            if name == '_inertiaThreshold':
                self._inertiaThreshold = value
            if name == '_batteryThreshold':
                self._batteryThreshold = value
    
    def createConfig(self):
        # Default values used to create settings folder if it is not available
        defaultMaxTemp = '30'
        defaultMinTemp = '1'
        defaultMaxHum = '90'
        defaultMinHum = '50'
        defaultInertiaThreshold = '2'
        defaultBatteryThreshold = '20'
        # Below are the properties for the tree structure
        settings = ET.Element('settings')
        propterty1 = ET.SubElement(settings, 'property')
        propterty1.set('name', '_maxTemp')
        propterty1.set('value', defaultMaxTemp)
        propterty2 = ET.SubElement(settings, 'property')
        propterty2.set('name', '_minTemp')
        propterty2.set('value', defaultMinTemp)
        propterty3 = ET.SubElement(settings, 'property')
        propterty3.set('name', '_maxHum')
        propterty3.set('value', defaultMaxHum)
        propterty4 = ET.SubElement(settings, 'property')
        propterty4.set('name', '_minHum')
        propterty4.set('value', defaultMinHum)
        propterty5 = ET.SubElement(settings, 'property')
        propterty5.set('name', '_inertiaThreshold')
        propterty5.set('value', defaultInertiaThreshold)
        propterty6 = ET.SubElement(settings, 'property')
        propterty6.set('name', '_batteryThreshold')
        propterty6.set('value', defaultBatteryThreshold)
        b_xml = ET.tostring(settings)
        with open(self._settingsFile, "wb") as f:
            f.write(b_xml)
    
    def updateConfig(self):
        tree = ET.parse(self._settingsFile)
        root = tree.getroot()
        for property in root.iter('property'):
            name = property.get('name')
            if name == '_maxTemp':
                property.set('value', self._maxTemp)
            if name == '_minTemp':
                property.set('value', self._minTemp)
            if name == '_maxHum':
                property.set('value', self._maxHum)
            if name == '_minHum':
                property.set('value', self._minHum)
            if name == '_inertiaThreshold':
                property.set('value', self._inertiaThreshold)
            if name == '_batteryThreshold':
                property.set('value', self._batteryThreshold)
        tree.write(self._settingsFile)
    
#   Testing
testing = False
if testing:
    test = Config()
    print(f'Before change max temp {test._maxTemp}')
    test.setMaxTemp('40')
    print(f'After change max temp {test._maxTemp}')

    print(f'Before change min temp {test._minTemp}')
    test.setMinTemp('2')
    print(f'After change min temp {test._minTemp}')

    print(f'Before change max hum {test._maxHum}')
    test.setMaxHum('80')
    print(f'After change max hum {test._maxHum}')

    print(f'Before change min hum {test._minHum}')
    test.setMinHum('40')
    print(f'After change min hum {test._minHum}')

    print(f'Before change inertia threshold {test._inertiaThreshold}')
    test.setInertia('1')
    print(f'After change inertia threshold {test._inertiaThreshold}')

    print(f'Before change battery threshold {test._batteryThreshold}')
    test.setBattery('18')
    print(f'After change battery threshold {test._batteryThreshold}')
    
    #   Testing shows that the settings XML also reflex the changes
    #   Further testing, the settings file is created with default settings if it is not found