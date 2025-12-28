# Alpha School Facility Budget Calculator

A web-based financial planning tool designed to help Alpha Schools calculate facility budgets, including lease costs, other facility expenses, and capital expenditure (CapEx) allocations based on student enrollment and tuition levels.

## 🌐 Live Demo

**[Try the Calculator Now!](https://markevanrozeboom.github.io/alpha_facilities_calculator/)**

Simply open the link above in your browser to start using the calculator immediately - no installation required!

## 📊 What Does This Calculator Do?

This calculator helps Alpha School administrators and planners:

- **Calculate facility budgets** based on student enrollment (10-500 students)
- **Compare scenarios** across three tuition levels ($40k, $50k, $65k)
- **Optimize resource allocation** between leasing and capital expenditures
- **Plan for different growth stages** with automatic margin targets and staffing levels
- **Visualize financial breakdowns** including revenue, expenses, and facility allocations

## ✨ Key Features

### Intelligent Auto-Calculations
- **Staffing Levels**: Automatically calculates Lead Guides, Guides, Head of School, and Admin positions based on student count
- **Target Margins**: Dynamic profit margins (0% for <30 students, 15% for 30-100, 25% for 100+)
- **Lease Terms**: Automatic lease term adjustments (2, 5, or 10 years) based on school size
- **Guide Ratios**: Maintains appropriate student-to-guide ratios

### Three-Component Facility Budget
1. **Annual Lease**: Direct facility rental costs
2. **Annual Other Facilities**: Utilities, maintenance, insurance, property taxes
3. **Annual CapEx Depreciation**: Capital expenditure for purchases and improvements

### Interactive Controls
- **Student Count Slider**: Adjust from 10 to 300 students with real-time updates
- **Allocation Slider**: Balance between Lease+Other vs. CapEx spending
- **Numeric Input**: Precise student count entry (10-500 students, extends beyond slider range)

### Comprehensive Visualizations
- Side-by-side comparison of all three tuition scenarios
- Color-coded budget categories for easy interpretation
- Reference tables showing staffing rules, margin tiers, and lease terms
- Detailed expense breakdowns for complete transparency

## 🚀 How to Use

1. **Open the Calculator**: Visit the [live demo](https://markevanrozeboom.github.io/alpha_facilities_calculator/) or open `index.html` in any modern web browser

2. **Set Student Count**: 
   - Use the slider to adjust the number of students (10-300 range)
   - Or type a specific number in the input box (10-500 supported)
   - Watch as margins, staffing, and lease terms auto-adjust

3. **Adjust Facility Allocation**:
   - Use the second slider to balance between Lease+Other (green) and CapEx (purple)
   - The calculator automatically splits Lease and Other Facilities equally
   - See how different allocations affect your total CapEx budget

4. **Compare Scenarios**:
   - Review all three tuition levels ($40k, $50k, $65k) side by side
   - Each card shows complete financial breakdown
   - Green highlighting indicates positive budgets, red for negative

5. **Review Detailed Breakdowns**:
   - Operating expenses (guides, admin, programs, software)
   - Target profit reserves based on student count
   - Available facility budget after operating costs and margins
   - Specific allocations for lease, other facilities, and total CapEx

## 📐 Business Logic

### Target Margin Tiers
- **<30 students**: 0% (Breakeven mode)
- **30-100 students**: 15% profit margin
- **100+ students**: 25% profit margin

### Staffing Rules
- **Lead Guides**: 1 (≤25 students), 2 (26-125), 3 (126-149), 4 (150+)
- **Guides**: Total guides needed = students ÷ 11, minus Lead Guides
- **Head of School**: 0 (≤50 students), 1 (51+)
- **Admin**: Always 1

### Salary Constants
- Lead Guide: $200,000/year
- Guide: $150,000/year
- Head of School: $300,000/year
- Admin: $60,000/year

### Per-Student Expenses
- Programs: $12,000/student (<30 students), $8,500/student (30+)
- Miscellaneous: $1,500/student
- Timeback Software: $5,000/student

### Lease Term Rules
- **<100 students**: 2-year terms
- **100-250 students**: 5-year terms
- **250+ students**: 10-year terms

### Facility Budget Calculation
```
Available for Facilities = Revenue - Operating Expenses - Target Profit

Lease + Other Total = Available × (Lease Allocation %)
  ├─ Annual Lease = (Lease + Other Total) ÷ 2
  └─ Annual Other Facilities = (Lease + Other Total) ÷ 2

Annual CapEx Depreciation = Available × (100 - Lease Allocation %)
Total CapEx Allowed = Annual CapEx × Lease Term Years
```

## 💻 Local Development

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required!

### Running Locally

**Option 1: Direct File Opening**
```bash
# Simply open the file in your browser
open index.html  # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

**Option 2: Local Web Server** (recommended for best performance)
```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js
npx http-server

# Then visit http://localhost:8000/index.html
```

### File Structure
```
alpha_facilities_calculator/
├── index.html                  # Main application (standalone, browser-ready)
├── facility-calculator.jsx     # React component (for potential build setups)
└── README.md                   # This file
```

## 🛠️ Technology Stack

- **React 18**: UI framework (loaded via CDN)
- **Tailwind CSS**: Styling framework (loaded via CDN)
- **Babel Standalone**: JSX transformation in browser
- **Pure JavaScript**: No build process required

## 🌟 Why This Approach?

This calculator uses a **zero-build** approach with CDN-loaded libraries, making it:
- ✅ Instantly accessible to anyone with a web browser
- ✅ Easy to deploy (just upload HTML file)
- ✅ Simple to modify (edit HTML directly, refresh browser)
- ✅ No installation, dependencies, or build tools needed
- ✅ Perfect for sharing and collaboration

## 📝 Customization

To modify the calculator constants or business logic:

1. Open `index.html` in any text editor
2. Find the constants section (search for "// Constants" in the JavaScript code)
3. Adjust values as needed:
   ```javascript
   const LEAD_GUIDE_SALARY = 200000;
   const GUIDE_SALARY = 150000;
   const HEAD_OF_SCHOOL_SALARY = 300000;
   const ADMIN_SALARY = 60000;
   const MISC_EXPENSE = 1500;
   const TIMEBACK_SOFTWARE = 5000;
   const tuitionLevels = [40000, 50000, 65000];
   ```
4. Save and refresh your browser

## 📄 License

This project is available for use by Alpha School administrators and planners.

## 🤝 Contributing

To suggest improvements or report issues:
1. Open an issue in this repository
2. Describe the enhancement or bug
3. Include screenshots if applicable

## 📞 Support

For questions or assistance with the calculator, please contact the repository owner.

---

**Made with ❤️ for Alpha Schools**
