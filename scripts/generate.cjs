const fs = require('fs');
const path = require('path');

const CLASS_SYLLABUS = {
  1:  ['Counting', 'Addition', 'Subtraction'],
  2:  ['Addition', 'Subtraction', 'Shapes'],
  3:  ['Multiplication', 'Division', 'Fractions'],
  4:  ['Fractions', 'Decimals', 'Geometry'],
  5:  ['Arithmetic', 'Fractions', 'Geometry', 'Word Problems'],
  6:  ['Integers', 'Fractions', 'Algebra', 'Ratio'],
  7:  ['Algebra', 'Integers', 'Geometry', 'Ratios'],
  8:  ['Algebra', 'Linear Equations', 'Geometry', 'Statistics'],
  9:  ['Algebra', 'Geometry', 'Statistics', 'Coordinate Geometry'],
  10: ['Algebra', 'Trigonometry', 'Geometry', 'Arithmetic Progressions', 'Statistics'],
  11: ['Functions', 'Sequences', 'Trigonometry', 'Statistics', 'Probability'],
  12: ['Calculus', 'Matrices', 'Vectors', 'Probability', 'Algebra'],
};

// Utilities
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const uuid = () => 'q_' + Math.random().toString(36).substr(2, 9);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const questions = [];

function generateOptions(correct, mutator) {
  const opts = new Set([correct.toString()]);
  while (opts.size < 4) {
    opts.add(mutator().toString());
  }
  return Array.from(opts);
}

// GENERATORS
const generators = {
  // --- CLASS 1-2 ---
  'Counting': (cLvl) => {
    const n = randInt(5, 50);
    return {
      text: `What number comes after ${n}?`,
      solution: (n + 1).toString(),
      type: 'Numerical', difficulty: 'Easy',
      explanation: `The number after ${n} is ${n + 1}.`
    };
  },
  'Addition': (cLvl) => {
    const a = randInt(1, 10 * cLvl);
    const b = randInt(1, 10 * cLvl);
    const sum = a + b;
    return {
      text: `What is ${a} + ${b}?`,
      solution: sum.toString(),
      options: [sum, sum+1, sum-1, sum+2].map(String),
      type: 'MCQ', difficulty: 'Easy',
      explanation: `${a} and ${b} make ${sum}.`
    };
  },
  'Subtraction': (cLvl) => {
    const a = randInt(10 * cLvl, 20 * cLvl);
    const b = randInt(1, a - 1);
    const diff = a - b;
    return {
      text: `What is ${a} - ${b}?`,
      solution: diff.toString(),
      type: 'Numerical', difficulty: 'Medium',
      explanation: `${a} minus ${b} equals ${diff}.`
    };
  },
  'Shapes': (cLvl) => {
    const shapes = [
      {s: 'Triangle', v: 3}, {s: 'Square', v: 4}, {s: 'Rectangle', v: 4}, {s: 'Pentagon', v: 5}, {s: 'Hexagon', v: 6}
    ];
    const s = pick(shapes);
    return {
      text: `How many sides does a ${s.s} have?`,
      solution: s.v.toString(),
      options: ['3','4','5','6'],
      type: 'MCQ', difficulty: 'Easy',
      explanation: `A ${s.s} has ${s.v} sides.`
    };
  },
  
  // --- CLASS 3-5 ---
  'Multiplication': (cLvl) => {
    const a = randInt(2, 12);
    const b = randInt(2, 12);
    return {
      text: `What is ${a} × ${b}?`,
      solution: (a * b).toString(),
      options: [(a*b), (a*b)+1, (a*b)-1, (a*b)+a].map(String),
      type: 'MCQ', difficulty: 'Medium',
      explanation: `${a} multiplied by ${b} is ${a * b}.`
    };
  },
  'Division': (cLvl) => {
    const b = randInt(2, 10);
    const q = randInt(2, 10);
    const a = b * q; // ensure perfect division
    return {
      text: `What is ${a} ÷ ${b}?`,
      solution: q.toString(),
      type: 'Numerical', difficulty: 'Medium',
      explanation: `${a} divided by ${b} is ${q}.`
    };
  },
  'Fractions': (cLvl) => { // Simplification
    const mul = randInt(2, 5);
    const num = randInt(1, 5);
    const den = randInt(num + 1, 9);
    return {
      text: `Simplify the fraction ${num * mul}/${den * mul}.`,
      solution: `${num}/${den}`,
      options: [`${num}/${den}`, `${num+1}/${den}`, `${num}/${den+1}`, `${num-1}/${den}`],
      type: 'MCQ', difficulty: 'Medium',
      explanation: `Divide the top and bottom by ${mul} to get ${num}/${den}.`
    };
  },
  'Decimals': (cLvl) => {
    const a = (randInt(10, 50) / 10).toFixed(1);
    const b = (randInt(10, 50) / 10).toFixed(1);
    const sum = (parseFloat(a) + parseFloat(b)).toFixed(1);
    return {
      text: `What is ${a} + ${b}?`,
      solution: sum.toString(),
      type: 'Numerical', difficulty: 'Medium',
      explanation: `Align the decimal point: ${a} + ${b} = ${sum}.`
    };
  },
  'Word Problems': (cLvl) => {
    const price = randInt(10, 50);
    const qty = randInt(2, 5);
    const cost = price * qty;
    return {
      text: `A pen costs ₹${price}. How much do ${qty} pens cost?`,
      solution: cost.toString(),
      type: 'Numerical', difficulty: 'Hard',
      explanation: `Multiply the price of one pen by the quantity: ${price} × ${qty} = ₹${cost}.`
    };
  },

  // --- CLASS 6-8 ---
  'Integers': (cLvl) => {
    const a = randInt(-15, 15);
    const b = randInt(-15, 15);
    return {
      text: `Calculate: ${a} + (${b})`,
      solution: (a + b).toString(),
      options: [(a+b), Math.abs(a+b), -(a+b), (a*b)].map(String),
      type: 'MCQ', difficulty: 'Medium',
      explanation: `${a} + (${b}) = ${a + b}.`
    }
  },
  'Ratio': (cLvl) => {
    const m = randInt(2, 5);
    return {
      text: `Simplify the ratio ${2 * m} : ${3 * m}`,
      solution: "2:3",
      options: ["2:3", "3:2", "1:2", "4:5"],
      type: 'MCQ', difficulty: 'Easy',
      explanation: `Divide both sides by the common factor ${m} to get 2:3.`
    }
  },
  'Ratios': (cLvl) => generators['Ratio'](cLvl),
  'Geometry': (cLvl) => {
    if (cLvl <= 5) {
      const v = randInt(5, 15);
      return {
        text: `Find the perimeter of a square with side ${v} cm.`,
        solution: (v * 4).toString(),
        type: 'Numerical', difficulty: 'Easy',
        explanation: `Perimeter of square = 4 × side = 4 × ${v} = ${v * 4} cm.`
      }
    } else {
      const b = randInt(4, 12);
      const h = randInt(4, 12);
      return {
        text: `Find the area of a triangle with base ${b} cm and height ${h} cm.`,
        solution: ((b * h) / 2).toString(),
        type: 'Numerical', difficulty: 'Medium',
        explanation: `Area = 1/2 × base × height = 1/2 × ${b} × ${h} = ${(b*h)/2} cm².`
      }
    }
  },
  'Algebra': (cLvl) => {
    if (cLvl <= 8) {
      const c = randInt(2, 6);
      const res = randInt(10, 30);
      const x = randInt(2, 10);
      const sum = (c * x) + res;
      return {
        text: `Solve for x: ${c}x + ${res} = ${sum}`,
        solution: x.toString(),
        type: 'Numerical', difficulty: 'Hard',
        explanation: `Subtract ${res} from both sides: ${c}x = ${sum - res}. Then divide by ${c} to get x = ${x}.`
      }
    } else { // Classes 9-12 Algebra
      const a = randInt(1, 4);
      const b = randInt(-5, 5);
      const c = randInt(-10, 10);
      return {
        text: `Find the discriminant of the quadratic equation ${a}x² + (${b})x + (${c}) = 0.`,
        solution: (Math.pow(b, 2) - 4*a*c).toString(),
        type: 'Numerical', difficulty: 'Medium',
        explanation: `Discriminant Δ = b² - 4ac. Δ = (${b})² - 4(${a})(${c}) = ${Math.pow(b,2) - 4*a*c}.`
      }
    }
  },
  'Linear Equations': (cLvl) => generators['Algebra'](6),
  
  // --- CLASS 9-10 ---
  'Statistics': (cLvl) => {
    const data = [randInt(2, 10), randInt(2, 10), randInt(2, 10), randInt(2, 10)];
    const mean = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1);
    return {
      text: `Find the mean of the dataset: ${data.join(', ')}`,
      solution: mean.toString(),
      type: 'Numerical', difficulty: 'Medium',
      explanation: `Mean = Sum / count = ${data.reduce((a,b)=>a+b)} / 4 = ${mean}.`
    };
  },
  'Coordinate Geometry': (cLvl) => {
    // Distance formula
    const x1 = randInt(0, 5), y1 = randInt(0, 5);
    const x2 = x1 + randInt(3, 4), y2 = y1 + randInt(3, 4); // ensures reasonable squares
    const distSq = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
    // Let's keep it simple and just ask for distance squared if not perfect square, or just use 3,4,5 pythagorean triples
    const p1 = [randInt(0,3), randInt(0,3)];
    const p2 = [p1[0] + 3, p1[1] + 4];
    return {
      text: `Find the distance between the points (${p1[0]}, ${p1[1]}) and (${p2[0]}, ${p2[1]}).`,
      solution: "5",
      options: ["5", "25", "7", "4"],
      type: 'MCQ', difficulty: 'Medium',
      explanation: `Distance formula: √((x2-x1)² + (y2-y1)²) = √(3² + 4²) = √25 = 5.`
    }
  },
  'Trigonometry': (cLvl) => {
    const vals = [
      {f: 'sin 30°', a: '1/2'}, {f: 'cos 60°', a: '1/2'},
      {f: 'tan 45°', a: '1'}, {f: 'sin 90°', a: '1'},
      {f: 'cos 0°', a: '1'}, {f: 'tan 0°', a: '0'}
    ];
    const q = pick(vals);
    return {
      text: `What is the value of ${q.f}?`,
      solution: q.a,
      options: ['0', '1', '1/2', '√3/2'],
      type: 'MCQ', difficulty: 'Easy',
      explanation: `Standard trigonometric table value: ${q.f} = ${q.a}.`
    }
  },
  'Arithmetic Progressions': (cLvl) => {
    const a = randInt(2, 10);
    const d = randInt(2, 5);
    const n = randInt(10, 20);
    const nth = a + (n - 1) * d;
    return {
      text: `Find the ${n}th term of the AP: ${a}, ${a+d}, ${a+2*d}...`,
      solution: nth.toString(),
      type: 'Numerical', difficulty: 'Medium',
      explanation: `Nth term = a + (n-1)d = ${a} + (${n}-1)${d} = ${nth}.`
    }
  },

  // --- CLASS 11-12 ---
  'Functions': (cLvl) => {
    const c = randInt(2, 5);
    const x = randInt(2, 5);
    return {
      text: `If f(x) = ${c}x², find f(${x}).`,
      solution: (c * Math.pow(x, 2)).toString(),
      type: 'Numerical', difficulty: 'Easy',
      explanation: `f(${x}) = ${c}(${x})² = ${c} × ${x * x} = ${c * Math.pow(x, 2)}.`
    }
  },
  'Sequences': (cLvl) => generators['Arithmetic Progressions'](cLvl),
  'Calculus': (cLvl) => {
    const p = randInt(3, 7);
    return {
      text: `What is the derivative of x^${p}?`,
      solution: `${p}x^${p-1}`,
      options: [`${p}x^${p-1}`, `x^${p-1}`, `${p+1}x^${p+1}`, `x^${p+1}`],
      type: "MCQ", difficulty: "Medium",
      explanation: `Using the power rule, d/dx(x^n) = nx^(n-1). So d/dx(x^${p}) = ${p}x^${p-1}.`
    }
  },
  'Matrices': (cLvl) => {
    const a = randInt(1, 5), b = randInt(1, 5), c = randInt(1, 5), d = randInt(1, 5);
    const det = (a * d) - (b * c);
    return {
      text: `Find the determinant of the 2x2 matrix: [${a}  ${b}] [${c}  ${d}]`,
      solution: det.toString(),
      type: "Numerical", difficulty: "Medium",
      explanation: `For matrix [a b; c d], Det = (a*d) - (b*c) = (${a}*${d}) - (${b}*${c}) = ${det}.`
    }
  },
  'Vectors': (cLvl) => {
    // Dot product
    const v1 = [randInt(1,4), randInt(1,4)];
    const v2 = [randInt(1,4), randInt(1,4)];
    const dot = (v1[0]*v2[0]) + (v1[1]*v2[1]);
    return {
      text: `Find the dot product of vectors u = (${v1[0]}i + ${v1[1]}j) and v = (${v2[0]}i + ${v2[1]}j).`,
      solution: dot.toString(),
      type: "Numerical", difficulty: "Medium",
      explanation: `Dot product = (x1*x2) + (y1*y2) = (${v1[0]}*${v2[0]}) + (${v1[1]}*${v2[1]}) = ${dot}.`
    }
  },
  'Probability': (cLvl) => {
    return {
      text: `A coin is tossed 3 times. What is the probability of getting exactly 3 heads? (as a fraction e.g. 1/8)`,
      solution: "1/8",
      options: ["1/8", "3/8", "1/4", "1/2"],
      type: "MCQ", difficulty: "Medium",
      explanation: `Total outcomes = 2³ = 8. Favorable outcomes (HHH) = 1. Probability = 1/8.`
    }
  }
};

// Generate 40 questions per class
Object.entries(CLASS_SYLLABUS).forEach(([cLvlStr, categories]) => {
  const cLvl = Number(cLvlStr);
  const qPerClass = 40;
  
  for (let i = 0; i < qPerClass; i++) {
    const cat = pick(categories);
    const gen = generators[cat] || generators['Addition']; // Fallback
    try {
      const q = gen(cLvl);
      questions.push({
        id: uuid(),
        classLevel: cLvl,
        category: cat,
        difficulty: q.difficulty || ['Easy', 'Medium', 'Hard'][randInt(0, 2)],
        type: q.type,
        text: q.text,
        options: q.options || [],
        solution: q.solution,
        explanation: q.explanation,
        examSource: `CBSE/ICSE Class ${cLvl} Synthetic`,
        tags: [cat.toLowerCase(), `class${cLvl}`]
      });
    } catch (e) {
      console.log(`Failed generating for ${cat}:`, e);
    }
  }
});

// Also keep some of the original hand-crafted ones from earlier to ensure quality
const oldQs = [
  {
    "id": "q9",
    "classLevel": 10,
    "category": "Algebra",
    "difficulty": "Easy",
    "type": "MCQ",
    "text": "Which of the following is a quadratic equation?",
    "options": ["x + 3 = 7", "x² + 2x + 1 = 0", "x³ = 8", "2x = 10"],
    "solution": "x² + 2x + 1 = 0",
    "explanation": "A quadratic equation has the highest power of the variable as 2. Only x² + 2x + 1 = 0 satisfies this."
  },
  {
    "id": "q12",
    "classLevel": 10,
    "category": "Trigonometry",
    "difficulty": "Hard",
    "type": "Numerical",
    "text": "If tan θ = 5/12, find sin θ (express as a fraction, e.g. 5/13).",
    "options": [],
    "solution": "5/13",
    "explanation": "In a right triangle: opposite = 5, adjacent = 12. Hypotenuse = √(25 + 144) = √169 = 13. So sin θ = 5/13."
  }
];

const allQs = [...oldQs.map(q => ({...q, tags: [q.category.toLowerCase()], examSource: 'Curated'})), ...questions];

fs.writeFileSync(
  path.join(__dirname, '../src/data/questions.json'),
  JSON.stringify(allQs, null, 2)
);

console.log(`Successfully generated ${allQs.length} questions!`);
