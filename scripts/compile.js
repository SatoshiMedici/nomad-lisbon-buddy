const fs = require('fs');
const path = require('path');

const contractsDir = path.resolve('contracts');
const outDir = path.resolve('src/contracts');
const outPath = path.join(outDir, 'LisbonTipping.json');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const placeholder = JSON.stringify({ abi: [], bytecode: '' }, null, 2);

function writePlaceholder() {
  fs.writeFileSync(outPath, placeholder);
}

let solc;
try {
  solc = require('solc');
} catch (e) {
  console.warn('[compile] solc not installed yet — writing placeholder artifact');
  writePlaceholder();
  process.exit(0);
}

const contractPath = path.join(contractsDir, 'LisbonTipping.sol');
if (!fs.existsSync(contractPath)) {
  console.warn('[compile] contract source not found — writing placeholder');
  writePlaceholder();
  process.exit(0);
}

const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: { 'LisbonTipping.sol': { content: source } },
  settings: {
    outputSelection: {
      '*': { '*': ['abi', 'evm.bytecode.object'] },
    },
  },
};

try {
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    output.errors.forEach((e) => {
      if (e.severity === 'error') {
        console.error(e.formattedMessage);
      } else {
        console.warn(e.formattedMessage);
      }
    });
  }

  if (
    !output.contracts ||
    !output.contracts['LisbonTipping.sol'] ||
    !output.contracts['LisbonTipping.sol']['LisbonTipping']
  ) {
    console.error('[compile] no contract output — writing placeholder');
    writePlaceholder();
    process.exit(0);
  }

  const contract = output.contracts['LisbonTipping.sol']['LisbonTipping'];
  const artifact = {
    abi: contract.abi,
    bytecode: contract.evm.bytecode.object,
  };

  fs.writeFileSync(outPath, JSON.stringify(artifact, null, 2));
  console.log('[compile] LisbonTipping.sol compiled successfully');
} catch (e) {
  console.error('[compile] failed:', e.message);
  writePlaceholder();
}
