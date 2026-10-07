const { toNum, formatNum } = require('./utils.cjs');

const engines = {
  'concrete-calculator': (inputs) => {
    const l = toNum(inputs.lengthFt, 20);
    const w = toNum(inputs.widthFt, 10);
    const thickIn = toNum(inputs.thicknessIn, 4);
    const wastePct = toNum(inputs.wastePct, 10);

    const thickFt = thickIn / 12;
    const rawCuFt = l * w * thickFt;
    const rawCuYd = rawCuFt / 27;
    const totalCuYd = rawCuYd * (1 + wastePct / 100);
    const totalCuM = totalCuYd * 0.764555;

    // Premix 60lb bags (approx 0.45 cu ft each) and 80lb bags (approx 0.60 cu ft each)
    const totalCuFtWithWaste = rawCuFt * (1 + wastePct / 100);
    const bags60 = Math.ceil(totalCuFtWithWaste / 0.45);
    const bags80 = Math.ceil(totalCuFtWithWaste / 0.60);

    return {
      primaryValue: `${formatNum(totalCuYd, 2)} Cubic Yards`,
      primaryLabel: 'Required Concrete Volume',
      subtext: `Metric: ${formatNum(totalCuM, 2)} m³ | Premix: ${bags80} bags (80 lb) or ${bags60} bags (60 lb)`,
      breakdown: [
        { label: 'Slab Dimensions', value: `${l} ft × ${w} ft × ${thickIn} in` },
        { label: 'Net Volume', value: `${formatNum(rawCuYd, 2)} cu yd (${formatNum(rawCuFt, 1)} cu ft)` },
        { label: 'Waste Margin', value: `${wastePct}%` },
        { label: 'Total Volume Needed', value: `${formatNum(totalCuYd, 2)} cu yd` },
        { label: '80 lb Premix Bags', value: `${bags80} bags` },
        { label: '60 lb Premix Bags', value: `${bags60} bags` }
      ],
      steps: [
        `Thickness in feet: ${thickIn} / 12 = ${formatNum(thickFt, 3)} ft`,
        `Cubic Feet = ${l} × ${w} × ${formatNum(thickFt, 3)} = ${formatNum(rawCuFt, 2)} cu ft`,
        `Cubic Yards = ${formatNum(rawCuFt, 2)} / 27 = ${formatNum(rawCuYd, 2)} cu yd`,
        `With ${wastePct}% waste = ${formatNum(totalCuYd, 2)} cu yd (${bags80} bags of 80 lb)`
      ]
    };
  },

  'brick-calculator': (inputs) => {
    const l = toNum(inputs.wallLength, 30);
    const h = toNum(inputs.wallHeight, 8);
    const type = inputs.brickType || 'single';
    const waste = toNum(inputs.waste, 10);

    const wallArea = l * h;
    // Standard modular brick with mortar: approx 7 bricks per sq ft for single wythe, 14 for double
    const bricksPerSqFt = type === 'double' ? 14 : 7;
    const rawBricks = wallArea * bricksPerSqFt;
    const totalBricks = Math.ceil(rawBricks * (1 + waste / 100));

    return {
      primaryValue: `${totalBricks.toLocaleString('en-US')} Bricks`,
      primaryLabel: `Total Bricks Needed (${type} wythe)`,
      subtext: `Wall Area: ${formatNum(wallArea, 0)} sq ft | Includes ${waste}% waste`,
      breakdown: [
        { label: 'Wall Surface Area', value: `${formatNum(wallArea, 1)} sq ft` },
        { label: 'Wythe Thickness', value: type === 'double' ? 'Double Wythe (14 bricks/sq ft)' : 'Single Wythe (7 bricks/sq ft)' },
        { label: 'Net Bricks', value: `${Math.round(rawBricks).toLocaleString('en-US')}` },
        { label: 'Mortar Waste Margin', value: `${waste}%` },
        { label: 'Total Bricks with Waste', value: `${totalBricks.toLocaleString('en-US')}` }
      ],
      steps: [
        `Wall Area = ${l} ft × ${h} ft = ${wallArea} sq ft`,
        `Net Bricks = ${wallArea} sq ft × ${bricksPerSqFt} = ${Math.round(rawBricks)}`,
        `With ${waste}% allowance for cuts & breakage = ${totalBricks} bricks`
      ]
    };
  },

  'cement-calculator': (inputs) => {
    const vol = toNum(inputs.volumeCuM, 2);

    // Standard 1:2:4 concrete mix ratio (1 cement : 2 sand : 4 gravel, total parts = 7)
    // Dry volume factor is approx 1.54 × wet volume
    const dryVol = vol * 1.54;
    const cementVol = dryVol * (1 / 7);
    const sandVol = dryVol * (2 / 7);
    const gravelVol = dryVol * (4 / 7);

    // Cement density: 1440 kg/m³, 50kg bag = 0.0347 m³
    const cementBags50kg = Math.ceil((cementVol * 1440) / 50);
    const sandTons = sandVol * 1.6; // sand approx 1.6 t/m³
    const gravelTons = gravelVol * 1.5; // gravel approx 1.5 t/m³

    return {
      primaryValue: `${cementBags50kg} Bags (50kg cement)`,
      primaryLabel: 'Cement Requirement (1:2:4 mix)',
      subtext: `Sand: ${formatNum(sandTons, 2)} tonnes | Gravel: ${formatNum(gravelTons, 2)} tonnes`,
      breakdown: [
        { label: 'Wet Concrete Volume', value: `${vol} m³` },
        { label: 'Dry Volume (1.54× factor)', value: `${formatNum(dryVol, 2)} m³` },
        { label: 'Cement (50 kg bags)', value: `${cementBags50kg} bags` },
        { label: 'Sand Volume & Weight', value: `${formatNum(sandVol, 2)} m³ (${formatNum(sandTons, 2)} t)` },
        { label: 'Gravel Volume & Weight', value: `${formatNum(gravelVol, 2)} m³ (${formatNum(gravelTons, 2)} t)` }
      ],
      steps: [
        `Dry volume conversion: ${vol} m³ × 1.54 = ${formatNum(dryVol, 2)} m³`,
        `Cement share (1/7): ${formatNum(cementVol, 3)} m³ × 1440 kg/m³ = ${formatNum(cementVol * 1440, 0)} kg (${cementBags50kg} bags of 50kg)`,
        `Sand share (2/7): ${formatNum(sandVol, 2)} m³ | Gravel share (4/7): ${formatNum(gravelVol, 2)} m³`
      ]
    };
  },

  'sand-calculator': (inputs) => {
    const l = toNum(inputs.length, 20);
    const w = toNum(inputs.width, 15);
    const depthIn = toNum(inputs.depthIn, 2);

    const depthFt = depthIn / 12;
    const cuFt = l * w * depthFt;
    const cuYd = cuFt / 27;
    // Dry sand density: approx 1.35 tons per cubic yard (2700 lbs)
    const tons = cuYd * 1.35;

    return {
      primaryValue: `${formatNum(cuYd, 2)} Cubic Yards`,
      primaryLabel: 'Required Sand Volume',
      subtext: `Estimated Weight: ${formatNum(tons, 2)} tons (${Math.round(tons * 2000)} lbs)`,
      breakdown: [
        { label: 'Dimensions', value: `${l} ft × ${w} ft × ${depthIn} in` },
        { label: 'Area Covered', value: `${l * w} sq ft` },
        { label: 'Cubic Feet', value: `${formatNum(cuFt, 2)} cu ft` },
        { label: 'Cubic Yards', value: `${formatNum(cuYd, 2)} cu yd` },
        { label: 'Estimated Tonnage (1.35 t/yd³)', value: `${formatNum(tons, 2)} tons` }
      ],
      steps: [
        `Area: ${l} × ${w} = ${l * w} sq ft`,
        `Depth: ${depthIn} / 12 = ${formatNum(depthFt, 3)} ft`,
        `Volume = ${formatNum(cuFt, 2)} cu ft / 27 = ${formatNum(cuYd, 2)} cu yd (~${formatNum(tons, 2)} tons)`
      ]
    };
  },

  'tile-calculator': (inputs) => {
    const rL = toNum(inputs.roomLength, 12);
    const rW = toNum(inputs.roomWidth, 10);
    const tLIn = toNum(inputs.tileLengthIn, 12);
    const tWIn = toNum(inputs.tileWidthIn, 12);
    const waste = toNum(inputs.wastePct, 10);

    const roomSqFt = rL * rW;
    const tileSqFt = (tLIn * tWIn) / 144;
    const rawTiles = roomSqFt / tileSqFt;
    const totalTiles = Math.ceil(rawTiles * (1 + waste / 100));

    return {
      primaryValue: `${totalTiles} Tiles`,
      primaryLabel: `Total Tiles Needed (${tLIn}″ × ${tWIn}″)`,
      subtext: `Room Area: ${roomSqFt} sq ft | Includes ${waste}% cutting waste`,
      breakdown: [
        { label: 'Room Area', value: `${roomSqFt} sq ft` },
        { label: 'Tile Dimensions', value: `${tLIn}″ × ${tWIn}″ (${formatNum(tileSqFt, 2)} sq ft/tile)` },
        { label: 'Net Tiles', value: `${Math.ceil(rawTiles)}` },
        { label: 'Cut & Breakage Waste', value: `${waste}%` },
        { label: 'Total Ordered Tiles', value: `${totalTiles}` }
      ],
      steps: [
        `Room Area = ${rL} ft × ${rW} ft = ${roomSqFt} sq ft`,
        `Tile Area = (${tLIn} × ${tWIn}) / 144 = ${formatNum(tileSqFt, 3)} sq ft`,
        `Raw Tiles = ${roomSqFt} / ${formatNum(tileSqFt, 3)} = ${formatNum(rawTiles, 1)}`,
        `With ${waste}% cutting allowance = ${totalTiles} tiles`
      ]
    };
  },

  'flooring-calculator': (inputs) => {
    const l = toNum(inputs.length, 18);
    const w = toNum(inputs.width, 14);
    const sqftPerBox = toNum(inputs.sqftPerBox, 24);
    const waste = toNum(inputs.wastePct, 10);

    const roomArea = l * w;
    const totalSqFt = roomArea * (1 + waste / 100);
    const boxes = Math.ceil(totalSqFt / sqftPerBox);

    return {
      primaryValue: `${boxes} Boxes`,
      primaryLabel: 'Flooring Boxes Needed',
      subtext: `Total Ordered Area: ${formatNum(totalSqFt, 1)} sq ft (Room: ${roomArea} sq ft + ${waste}% waste)`,
      breakdown: [
        { label: 'Room Surface Area', value: `${roomArea} sq ft` },
        { label: 'Waste Factor', value: `${waste}%` },
        { label: 'Gross Square Footage', value: `${formatNum(totalSqFt, 1)} sq ft` },
        { label: 'Coverage per Box', value: `${sqftPerBox} sq ft` },
        { label: 'Boxes Required', value: `${boxes} boxes` }
      ],
      steps: [
        `Room Area = ${l} × ${w} = ${roomArea} sq ft`,
        `Gross Sq Ft with ${waste}% waste = ${roomArea} × ${1 + waste / 100} = ${formatNum(totalSqFt, 1)} sq ft`,
        `Boxes = ${formatNum(totalSqFt, 1)} / ${sqftPerBox} = ${formatNum(totalSqFt / sqftPerBox, 2)} -> Round up to ${boxes} boxes`
      ]
    };
  },

  'paint-calculator': (inputs) => {
    const l = toNum(inputs.length, 16);
    const w = toNum(inputs.width, 12);
    const h = toNum(inputs.height, 9);
    const doors = toNum(inputs.doors, 2);
    const windows = toNum(inputs.windows, 2);
    const coats = toNum(inputs.coats, 2);

    const grossWallArea = 2 * (l + w) * h;
    const deductions = doors * 21 + windows * 15; // 21 sq ft standard door, 15 sq ft window
    const netWallArea = Math.max(0, grossWallArea - deductions);
    const totalSqFt = netWallArea * coats;

    // Standard paint coverage: 350 sq ft per gallon (~32.5 m² per 3.78L)
    const gallons = Math.ceil(totalSqFt / 350);
    const liters = (totalSqFt / 350) * 3.78541;

    return {
      primaryValue: `${gallons} Gallon${gallons === 1 ? '' : 's'} (${formatNum(liters, 1)} L)`,
      primaryLabel: `Paint Required (${coats} Coats)`,
      subtext: `Net Wall Area: ${Math.round(netWallArea)} sq ft (${doors} doors, ${windows} windows excluded)`,
      breakdown: [
        { label: 'Gross Wall Area', value: `${grossWallArea} sq ft` },
        { label: 'Deductions (doors & windows)', value: `-${deductions} sq ft` },
        { label: 'Net Wall Surface per Coat', value: `${Math.round(netWallArea)} sq ft` },
        { label: 'Coats of Paint', value: `${coats}` },
        { label: 'Total Coverage Area', value: `${Math.round(totalSqFt)} sq ft` },
        { label: 'Gallons (350 sq ft/gal)', value: `${gallons} gal` }
      ],
      steps: [
        `Gross perimeter area = 2 × (${l} + ${w}) × ${h} = ${grossWallArea} sq ft`,
        `Deductions = ${doors} doors (42 sq ft) + ${windows} windows (30 sq ft) = ${deductions} sq ft`,
        `Net Area per Coat = ${netWallArea} sq ft`,
        `Total Area (${coats} coats) = ${totalSqFt} sq ft -> ${gallons} gallons needed`
      ]
    };
  },

  'roofing-calculator': (inputs) => {
    const l = toNum(inputs.houseLength, 40);
    const w = toNum(inputs.houseWidth, 30);
    const pitch = toNum(inputs.pitch, 6); // e.g. 6/12 pitch
    const waste = toNum(inputs.wastePct, 10);

    const groundArea = l * w;
    // Pitch multiplier: √(1 + (pitch/12)²)
    const pitchMult = Math.sqrt(1 + Math.pow(pitch / 12, 2));
    const roofArea = groundArea * pitchMult * (1 + waste / 100);

    // 1 roofing square = 100 sq ft, 3 bundles per square
    const squares = roofArea / 100;
    const bundles = Math.ceil(squares * 3);

    return {
      primaryValue: `${formatNum(squares, 1)} Squares (${bundles} Bundles)`,
      primaryLabel: `Roofing Shingles Needed (${pitch}/12 Pitch)`,
      subtext: `Estimated Roof Surface: ${Math.round(roofArea)} sq ft (incl. ${waste}% waste)`,
      breakdown: [
        { label: 'Footprint Area', value: `${groundArea} sq ft` },
        { label: 'Roof Pitch', value: `${pitch}/12 (Multiplier: ${formatNum(pitchMult, 3)})` },
        { label: 'Total Roof Area', value: `${Math.round(roofArea)} sq ft` },
        { label: 'Roofing Squares (100 sq ft)', value: `${formatNum(squares, 2)} squares` },
        { label: 'Shingle Bundles (3/square)', value: `${bundles} bundles` }
      ],
      steps: [
        `Ground footprint = ${l} × ${w} = ${groundArea} sq ft`,
        `Pitch multiplier for ${pitch}/12 = √(1 + (${pitch}/12)²) = ${formatNum(pitchMult, 3)}`,
        `Roof Area with ${waste}% waste = ${groundArea} × ${formatNum(pitchMult, 3)} × ${1 + waste / 100} = ${Math.round(roofArea)} sq ft`,
        `Ordered: ${bundles} bundles of shingles`
      ]
    };
  },

  'wall-area-calculator': (inputs) => {
    const l = toNum(inputs.length, 15);
    const w = toNum(inputs.width, 12);
    const h = toNum(inputs.height, 9);
    const deductions = toNum(inputs.deductions, 50);

    const gross = 2 * (l + w) * h;
    const net = Math.max(0, gross - deductions);

    return {
      primaryValue: `${net} sq ft`,
      primaryLabel: 'Net Interior Wall Area',
      subtext: `Gross: ${gross} sq ft | Deductions: ${deductions} sq ft`,
      breakdown: [
        { label: 'Room Dimensions', value: `${l} ft × ${w} ft × ${h} ft` },
        { label: 'Gross 4-Wall Area', value: `${gross} sq ft` },
        { label: 'Doors / Windows Deductions', value: `-${deductions} sq ft` },
        { label: 'Net Usable Wall Area', value: `${net} sq ft (${formatNum(net * 0.092903, 1)} m²)` }
      ],
      steps: [
        `Perimeter = 2 × (${l} + ${w}) = ${2 * (l + w)} ft`,
        `Gross Area = Perimeter × Height = ${2 * (l + w)} × ${h} = ${gross} sq ft`,
        `Net Area = ${gross} - ${deductions} = ${net} sq ft`
      ]
    };
  },

  'stair-calculator': (inputs) => {
    const totalRise = toNum(inputs.totalRiseIn, 108);
    const targetRiser = toNum(inputs.targetRiserIn, 7.5);

    if (totalRise <= 0 || targetRiser <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Total rise must be positive.' };

    const stepsCount = Math.round(totalRise / targetRiser);
    const exactRiser = totalRise / stepsCount;
    // Standard rule: 2 × Riser + Tread ≈ 25 inches (standard tread 10 to 11 inches)
    const recTread = Math.max(10, Math.min(12, 25 - 2 * exactRiser));
    const totalRun = (stepsCount - 1) * recTread;

    return {
      primaryValue: `${stepsCount} Steps (${formatNum(exactRiser, 2)}″ riser)`,
      primaryLabel: 'Staircase Configuration',
      subtext: `Recommended Tread: ${formatNum(recTread, 1)}″ | Total Stair Run: ${formatNum(totalRun / 12, 1)} ft`,
      breakdown: [
        { label: 'Total Elevation Rise', value: `${totalRise} inches (${formatNum(totalRise / 12, 2)} ft)` },
        { label: 'Number of Risers (Steps)', value: `${stepsCount}` },
        { label: 'Exact Riser Height', value: `${formatNum(exactRiser, 3)} inches` },
        { label: 'Recommended Tread Depth', value: `${formatNum(recTread, 2)} inches` },
        { label: 'Total Horizontal Run', value: `${formatNum(totalRun, 1)} inches (${formatNum(totalRun / 12, 2)} ft)` }
      ],
      steps: [
        `Calculated number of steps: ${totalRise} / ${targetRiser} = ${formatNum(totalRise / targetRiser, 1)} -> ${stepsCount} steps`,
        `Exact individual riser height = ${totalRise} / ${stepsCount} = ${formatNum(exactRiser, 2)} inches`,
        `Applied Blondel's stair comfort formula (2R + T = 25″) -> Tread = ${formatNum(recTread, 1)} inches`
      ]
    };
  },

  'gravel-calculator': (inputs) => {
    const l = toNum(inputs.length, 50);
    const w = toNum(inputs.width, 10);
    const dIn = toNum(inputs.depthIn, 3);

    const dFt = dIn / 12;
    const cuFt = l * w * dFt;
    const cuYd = cuFt / 27;
    // Crushed gravel density: approx 1.4 tons per cu yard
    const tons = cuYd * 1.4;

    return {
      primaryValue: `${formatNum(tons, 2)} Tons (${formatNum(cuYd, 2)} yd³)`,
      primaryLabel: 'Crushed Gravel Requirement',
      subtext: `Driveway/Pathway Area: ${l * w} sq ft at ${dIn} inches depth`,
      breakdown: [
        { label: 'Coverage Area', value: `${l * w} sq ft` },
        { label: 'Volume (cu ft)', value: `${formatNum(cuFt, 1)} cu ft` },
        { label: 'Volume (cu yd)', value: `${formatNum(cuYd, 2)} cu yd` },
        { label: 'Estimated Weight (tons)', value: `${formatNum(tons, 2)} tons` }
      ],
      steps: [
        `Area = ${l} × ${w} = ${l * w} sq ft`,
        `Volume = (${l * w} × ${dIn / 12}) / 27 = ${formatNum(cuYd, 2)} cu yd`,
        `Tonnage = ${formatNum(cuYd, 2)} yd³ × 1.4 tons/yd³ = ${formatNum(tons, 2)} tons`
      ]
    };
  },

  'mulch-calculator': (inputs) => {
    const l = toNum(inputs.length, 30);
    const w = toNum(inputs.width, 8);
    const dIn = toNum(inputs.depthIn, 3);

    const dFt = dIn / 12;
    const cuFt = l * w * dFt;
    const cuYd = cuFt / 27;
    const bags2cuFt = Math.ceil(cuFt / 2);
    const bags3cuFt = Math.ceil(cuFt / 3);

    return {
      primaryValue: `${formatNum(cuYd, 2)} Cubic Yards`,
      primaryLabel: 'Mulch Needed',
      subtext: `Or ${bags2cuFt} bags of 2 cu ft / ${bags3cuFt} bags of 3 cu ft`,
      breakdown: [
        { label: 'Garden Bed Area', value: `${l * w} sq ft` },
        { label: 'Mulch Depth', value: `${dIn} inches` },
        { label: 'Cubic Feet', value: `${formatNum(cuFt, 1)} cu ft` },
        { label: 'Cubic Yards', value: `${formatNum(cuYd, 2)} cu yd` },
        { label: '2 cu ft Bags', value: `${bags2cuFt} bags` },
        { label: '3 cu ft Bags', value: `${bags3cuFt} bags` }
      ],
      steps: [
        `Area: ${l} × ${w} = ${l * w} sq ft`,
        `Volume: (${l * w} × ${dIn / 12}) / 27 = ${formatNum(cuYd, 2)} cu yd`,
        `Bag Count: ${formatNum(cuFt, 1)} cu ft / 2 cu ft = ${bags2cuFt} bags`
      ]
    };
  }
};

module.exports = engines;

