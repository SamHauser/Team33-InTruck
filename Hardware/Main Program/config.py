######################################
#   Purpose is for this class to control
#   the persistant config file.
#   Data stored to this device is device specific information
#   Library needed: pip install beautifulsoup4
######################################

# change to timmings/pollings

import xml.etree.ElementTree as ET # used for creating the tree structure in the XML file
import os # used for file checking

class Config:
    _settingsFile = 'settings.xml'
    _tempInterval = None
    _humInterval = None
    _gpsInterval = None
    _inertiaThreshold = None
    _batteryPercentSD = None
     
    def __init__(self):
        self.onLoad()
    
    def setTempInterval(self, time):
        self._tempInterval = time
        self.updateConfig()
        
    def setHumInterval(self, time):
        self._humInterval = time
        self.updateConfig()
        
    def setGpsInterval(self, time):
        self._gpsInterval = time
        self.updateConfig()

    def setInertia(self, inertia):
        self._inertiaThreshold = inertia
        self.updateConfig()
    
    def setBattery(self, battery):
        self._batteryPercentSD = battery
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
            if name == '_tempInterval':
                self._tempInterval = value
            if name == '_humInterval':
                self._humInterval = value
            if name == '_gpsInterval':
                self._gpsInterval = value
            if name == '_inertiaThreshold':
                self._inertiaThreshold = value
            if name == '_batteryPercentSD':
                self._batteryPercentSD = value
    
    def createConfig(self):
        # Default values used to create settings folder if it is not available
        defaultTempInterval = '30'
        defaultHumInterval = '90'
        defaultGpsInterval = '5'
        defaultInertiaThreshold = '2'
        defaultBatteryThreshold = '20'
        # Below are the properties for the tree structure
        settings = ET.Element('settings')
        propterty1 = ET.SubElement(settings, 'property')
        propterty1.set('name', '_tempInterval')
        propterty1.set('value', defaultTempInterval)
        propterty2 = ET.SubElement(settings, 'property')
        propterty2.set('name', '_humInterval')
        propterty2.set('value', defaultHumInterval)
        propterty3 = ET.SubElement(settings, 'property')
        propterty3.set('name', '_gpsInterval')
        propterty3.set('value', defaultGpsInterval)
        propterty5 = ET.SubElement(settings, 'property')
        propterty5.set('name', '_inertiaThreshold')
        propterty5.set('value', defaultInertiaThreshold)
        propterty6 = ET.SubElement(settings, 'property')
        propterty6.set('name', '_batteryPercentSD')
        propterty6.set('value', defaultBatteryThreshold)
        b_xml = ET.tostring(settings)
        with open(self._settingsFile, "wb") as f:
            f.write(b_xml)
    
    def updateConfig(self):
        tree = ET.parse(self._settingsFile)
        root = tree.getroot()
        for property in root.iter('property'):
            name = property.get('name')
            if name == '_tempInterval':
                property.set('value', self._tempInterval)
            if name == '_humInterval':
                property.set('value', self._humInterval)
            if name == '_gpsInterval':
                property.set('value', self._gpsInterval)
            if name == '_inertiaThreshold':
                property.set('value', self._inertiaThreshold)
            if name == '_batteryPercentSD':
                property.set('value', self._batteryPercentSD)
        tree.write(self._settingsFile)
    
#   Testing
testing = True
if testing:
    test = Config()
    print(f'Before change max temp {test._tempInterval}')
    test.setMaxTemp('40')
    print(f'After change max temp {test._tempInterval}')

    print(f'Before change max hum {test._humInterval}')
    test.setMaxHum('80')
    print(f'After change max hum {test._humInterval}')

    print(f'Before change min hum {test._gpsInterval}')
    test.setMinHum('2')
    print(f'After change min hum {test._gpsInterval}')

    print(f'Before change inertia threshold {test._inertiaThreshold}')
    test.setInertia('1')
    print(f'After change inertia threshold {test._inertiaThreshold}')

    print(f'Before change battery threshold {test._batteryPercentSD}')
    test.setBattery('18')
    print(f'After change battery threshold {test._batteryPercentSD}')
    
    #   Testing shows that the settings XML also reflex the changes
    #   Further testing, the settings file is created with default settings if it is not found