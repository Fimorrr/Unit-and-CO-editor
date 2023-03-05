function CodeGenerator(unitProperties) {
    let text = "";

    text += `using Lean.Localization;
    using System.Collections;
    using System.Collections.Generic;
    using UnityEngine;
    
    public class UnitStatsScript : MonoBehaviour
    {}
    
    [System.Serializable]
    public class UnitStats
    {`;

    unitProperties.forEach((unitProperty) => {
        text += "\npublic " + getStatType(unitProperty) + " " + unitProperty.name + ";";
    });

    text += "\npublic void initUnitStats()\n{";

    unitProperties.forEach((unitProperty) => {
        text += "\n" + unitProperty.name + " = new " + getStatType(unitProperty) + "();";  
    });

    text += "\n}";
    text += "\npublic UnitStats(UnitStats unitStats)\n{\ninitUnitStats();";

    unitProperties.forEach((unitProperty) => {
        text += "\n" + unitProperty.name + ".value = unitStats." + unitProperty.name + ".value;";  
    });

    text += "\n}";
    text += "\npublic string getUpgradeText()\n{\nList<string> list = new List<string>();";

    unitProperties.forEach((unitProperty) => {
        text += '\naddPropertyText(list, "' + unitProperty.name + '", ' + unitProperty.name + ");";
    });

    text += '\nreturn string.Join("\\n", list);\n}';
    text += "\npublic void AddStats(UpgradeItemJson upgrade, bool overwrite)\n{";

    unitProperties.forEach((unitProperty) => {
        text += getAddStats(unitProperty);
    });

    text += "\n}\n";
    text += `string getLocalizedText(string property)
    {
        var localizedProperty = LeanLocalization.GetTranslationText(property, property);

        return localizedProperty;
    }

    public void addPropertyText(List<string> list, string property, NullableInt value)
    {
        if (value.hasValue)
        {
            var localizedProperty = getLocalizedText(property);
            string formattedValue = value.value.ToString();

            if (localizedProperty.Contains("{0}"))
            {
                list.Add(localizedProperty.Replace("{0}", formattedValue));
            }
            else
            {
                list.Add(localizedProperty + (value.value >= 0 ? " +" : " ") + value.value);
            }
        }
    }

    public void addPropertyText(List<string> list, string property, NullableString value)
    {
        if (value.hasValue)
        {
            var localizedProperty = getLocalizedText(property);
            var localizedValue = LeanLocalization.GetTranslationText(value.value);
            if (localizedProperty.Contains("{0}"))
            {
                list.Add(localizedProperty.Replace("{0}", localizedValue));
            }
        }
    }

    public void addPropertyText(List<string> list, string property, NullableBool value)
    {
        if (value.hasValue)
        {
            var localizedProperty = getLocalizedText(property);
            
            if (!value.value)
            {
                localizedProperty = LeanLocalization.GetTranslationText("nowDoesntWork") + ": " + localizedProperty;
            }

            list.Add(localizedProperty);
        }
    }

    public void addPropertyText(List<string> list, string property, NullableMovementType value)
    {
        if (value.hasValue)
        {
            var localizedProperty = getLocalizedText(property);
            var localizedValue = getLocalizedText(value.value.ToString());
            list.Add(localizedProperty + " -> " + localizedValue);
        }
    }

    public void addPropertyText(List<string> list, string property, NullableArmorType value)
    {
        if (value.hasValue)
        {
            var localizedProperty = getLocalizedText(property);
            var localizedValue = getLocalizedText(value.value.ToString());
            list.Add(localizedProperty + " -> " + localizedValue);
        }
    }
}

[System.Serializable]
public class NullableInt
{
    public int value;
    public bool hasValue;
    public List<UpgradedBy> upgradedBy;

    public NullableInt()
    {
        upgradedBy = new List<UpgradedBy>();
    }

    public int getAddValue()
    {
        if (hasValue)
        {
            return value;
        }
        return 0;
    }

    public NullableInt getAddObject(NullableInt addObject, UpgradeItemJson upgrade, bool overwrite)
    {
        if (hasValue)
        {
            if (overwrite)
            {
                addObject.value = value;
            }
            else
            {
                var upgradedBy = new UpgradedBy();
                upgradedBy.iconNumber = upgrade.icon;
                upgradedBy.upgradeName = upgrade.itemName;
                upgradedBy.upgradeDescription = upgrade.unitProperties.getUpgradeText();
                
                addObject.value += value;
                addObject.upgradedBy.Add(upgradedBy);
            }
        }

        return addObject;
    }
}

[System.Serializable]
public class NullableBool
{
    public bool value;
    public bool hasValue;

    public bool getAddValue(bool prevValue)
    {
        if (hasValue)
        {
            return value;
        }
        return prevValue;
    }
}

[System.Serializable]
public class NullableString
{
    public string value;
    public bool hasValue;

    public string getAddValue(string prevValue)
    {
        if (hasValue)
        {
            return value;
        }
        return prevValue;
    }
}

[System.Serializable]
public class NullableMovementType
{
    public UnitScript.movementTypes value;
    public bool hasValue;
}

[System.Serializable]
public class NullableArmorType
{
    public UnitScript.armorTypes value;
    public bool hasValue;
}

[System.Serializable]
public class NullableDivision
{
    public UnitScript.divisions value;
    public bool hasValue;
}

[System.Serializable]
public class NullableBuildBy
{
    public BuildingScript.buildRules value;
    public bool hasValue;
}

[System.Serializable]
public class UpgradedBy
{
    public int iconNumber;
    public string upgradeName;
    public string upgradeDescription;
}

[System.Serializable]
public class UpgradedByInfo
{
    public UpgradedBy upgradedBy;
    public int damage;
    public int deltaDamage;
    public bool isAttack;
}`;

    console.log(text);
}

function getAddStats(unitProperty) {
    let row = "\n" + unitProperty.name;

    switch(unitProperty.type) {
        case "enum":
            row += ".value = upgrade.unitProperties." + unitProperty.name + ".value;";
            return "\nif (upgrade.unitProperties." + unitProperty.name + ".hasValue)\n{" + row + "\n}";
        case "int":
            row += " = upgrade.unitProperties." + unitProperty.name;
            row += ".getAddObject(" + unitProperty.name + ", upgrade, overwrite);";
            return row;
        default:
            row += ".value = upgrade.unitProperties." + unitProperty.name;
            row += ".getAddValue(" + unitProperty.name + ".value);";
            return row;
    }
}

function getStatType(unitProperty) {
    switch(unitProperty.type) {
        case "enum":
            return "Nullable" + getFirstUppercase(unitProperty.name);
        default:
            return "Nullable" + getFirstUppercase(unitProperty.type);
    }
}

function getFirstUppercase(str)
{
    if (str.length === 0)
        return "";
    else if (str.length === 1)
        return str[0].toUpperCase() + "";
    else
        return str[0].toUpperCase() + str.substr(1);
}

export default CodeGenerator;