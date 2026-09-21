# MOF Quest

**A human benchmark for predicting metal-organic framework synthesis outcomes.**

MOF Quest is an interactive research platform for studying chemical intuition in metal-organic framework (MOF) synthesis. Participants review literature-derived reaction conditions, predict whether the specified synthesis will succeed, and indicate their confidence. The platform records these judgments for comparison with experimental reference outcomes and independently evaluated machine-learning models.

Developed by the **Zheng Research Group at Washington University in St. Louis**, MOF Quest supports the broader [MOFinder project](https://github.com/zzhenglab/MOFinder) on literature mining, negative-data reasoning, and predictive materials synthesis.

<p align="center">
  <img src="components/mof_quest_demo.png" alt="MOF Quest interface showing reaction conditions and the prediction confidence slider" width="600">
</p>

[MOFinder](https://github.com/zzhenglab/MOFinder) · [Research Group](https://zhenglab.wustl.edu/) · [Report an Issue](https://github.com/zzhenglab/MOF-Quest/issues)

## Research motivation

Successful syntheses are well represented in the chemical literature, while unsuccessful experiments often receive limited attention or appear only in narrative discussions. This imbalance makes it difficult to learn which combinations of building blocks and reaction conditions are unlikely to produce the intended material.

MOF Quest provides a controlled setting for examining how chemists recognize both successful and unsuccessful synthesis conditions. It supports analysis of prediction accuracy, confidence, and self-reported experience, and provides a common set of reaction scenarios for human and model evaluation.

The associated study includes responses from **98 chemists** with different levels of MOF synthesis experience. Detailed statistical analyses and model comparisons are described in the accompanying study and supporting information.

## Benchmark design

The current benchmark contains **22 literature-derived reaction scenarios**, comprising **11 reference-positive outcomes** and **11 reference-negative outcomes**. A separate demonstration question introduces the interface and does not contribute to the final score.

All participants receive the same reaction panel in a randomized order. The scenarios cover diverse metal precursors, linker families, solvents, modulators, and synthesis conditions.

### Reaction representation

Each question presents eight fields:

| Field | Description | Unit or representation |
| --- | --- | --- |
| `metal_precursor` | Metal source used in the reaction | Chemical formula or name |
| `organic_linker` | Organic linker or combination of linkers | Chemical name |
| `modulator` | Listed modulator or additive | Chemical name; `null` when none is listed |
| `solvent` | Solvent or solvent mixture | Chemical name |
| `metal_concentration_mM` | Metal concentration | mM |
| `M_L_ratio` | Metal-to-linker molar ratio | Displayed as M:L = value:1 |
| `temperature_C` | Reaction temperature | °C |
| `time_h` | Reaction duration | Hours; `null` when unavailable |

For scenarios containing multiple linkers, the single M:L value does not specify the individual linker proportions.

Source DOIs are retained with the reaction records. Selected negative records also include notes describing the source evidence. DOIs and failure notes are not displayed on the reaction card during prediction.

### Predictions and scoring

Participants select one of four responses:

| Response | Binary prediction | Confidence category |
| --- | --- | --- |
| Very Confident Fail | N | Very confident |
| Likely Fail | N | Likely |
| Likely Success | P | Likely |
| Very Confident Success | P | Very confident |

Each answer receives **one point** if its binary prediction matches the reference outcome and **zero points** otherwise. The maximum score is **22**. Confidence is recorded separately and does not change the score.

Because the reference panel is balanced, predicting success for every question or failure for every question produces a score of 11/22, or 50%. The confidence options are ordinal judgments, not numerical probability estimates.

### Interpreting the outcomes

A positive label denotes the reference successful MOF synthesis outcome for that scenario. A negative label denotes an unsuccessful outcome under the specified conditions. Depending on the source, an unsuccessful outcome may involve no product, amorphous material, competing phases, or failure to obtain the intended framework.

Labels are specific to the recorded reaction and its reference outcome. A negative label does not establish that the same metal and linker cannot form a framework under different conditions.

This benchmark measures individual predictions from compact written reaction descriptions across a fixed panel of systems. Its scope does not include the full experimental process of troubleshooting, characterization, or iterative synthesis optimization.

## Participant workflow

1. Read the study information and provide an email address and self-reported MOF synthesis experience.
2. Complete the demonstration question to become familiar with the confidence slider.
3. Review each reaction and confirm a prediction. The interface provides correctness feedback before advancing.
4. Complete the 22-question panel and view the final score.
5. Optional: download the detailed CSV results and consult the source DOI links.

## Features

- **Randomized presentation:** the full question panel is shuffled for each initialized session.
- **Chemical structure previews:** linker names have hover previews retrieved from NCI/Cactus or PubChem, where available.
- **Confidence-aware response records:** each answer preserves both prediction direction and confidence category.
- **Automatic scoring:** predictions are checked against the bundled reference labels.
- **Participant exports:** a detailed CSV includes reaction IDs, metal precursors, linkers, predictions, reference outcomes, correctness, and DOIs.
- **Local backups:** session records are stored in the browser's local storage.
- **Remote submission:** completed responses can be sent to a configured Google Apps Script endpoint.
- **Local administration:** an administrative view supports inspection, CSV export, and resubmission of records stored in the current browser.

## Technology

| Component | Implementation |
| --- | --- |
| User interface | React and TypeScript |
| Development and build tools | Vite |
| Styling | Tailwind CSS loaded through a CDN |
| Icons | Lucide React |
| Local persistence | Browser `localStorage` |
| Remote collection | Google Apps Script endpoint for the study's Google Sheets workflow |
| Structure images | NCI/Cactus and PubChem |

Google AI Studio and Gemini supported initial application development. **The current quiz does not make Gemini API calls and does not require a Gemini API key.**

## Run locally

### Prerequisites

- Node.js 22.12 or later in the 22.x series, or a compatible newer release
- npm
- Git
- A modern web browser

Internet access is needed for externally hosted styling, structure images, and remote response submission.

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/zzhenglab/MOF-Quest.git
cd MOF-Quest
npm install
```

### 2. Check the application entry point

For standard Vite execution, `index.html` must load `index.tsx`. Ensure that the end of the HTML body contains:

```html
<body>
  <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
```

If the module script is missing, add it before `</body>`.

### 3. Configure response submission

The response endpoint is defined by `GOOGLE_SCRIPT_URL` in `App.tsx`. Before completing test sessions, replace the existing study endpoint with your own test deployment:

```ts
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

The Google Apps Script backend implementation is not included in this repository. A separate deployment is required to collect responses in your own Google Sheet or send email reports.

For interface-only testing, disable the remote submission calls in `App.tsx` and the resubmission action in `components/AdminPanel.tsx`.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), or the address printed by Vite.

### 5. Build and preview

```bash
npm run build
npm run preview
```

Vite writes the production build to `dist/`. The preview command serves that build locally; it does not deploy the application.

## Response data and collection

The submission payload follows the `UserResult` interface in `types.ts`:

| Field | Contents |
| --- | --- |
| `email` | Participant email address |
| `yearsOfExperience` | Self-reported experience category |
| `score` | Number of correct predictions |
| `totalQuestions` | Number of questions in the session |
| `timestamp` | Submission timestamp |
| `questionIds` | Reaction IDs in presentation order |
| `answers` | Responses indexed by reaction ID, plus an experience entry |
| `detailedTranscript` | Text summary of the session |

Completed-session submissions use an HTTP POST containing JSON with a `text/plain` content type. The backend should parse this payload and implement the required storage and reporting behavior.

Local records use the storage key `MOF_LOCAL_STORAGE_V1`. They are specific to the current browser and site origin. The administrative view reads these local records; it does not retrieve a central participant database.

The implementation also attempts to save and submit partial responses after ten minutes of inactivity or when a participant leaves the page during an active session. Unanswered questions are recorded as `ABANDONED`.

### Deployment considerations

- Submissions use `no-cors` requests, so the frontend cannot verify that the backend successfully stored a response. Confirm receipt in the destination system.
- The administrative access check runs in client-side code and does not provide server-side authentication.
- The average score displayed in `ResultsView.tsx` is a fixed value, not a live calculation from collected responses.
- Study dates, compensation details, contact information, and participant disclosures are embedded in the interface. Update them for a new deployment and ensure the disclosures match its submission behavior.

## Repository organization

| Path | Purpose |
| --- | --- |
| `App.tsx` | Participant flow, consent display, scoring, submission, and local backups |
| `constants.ts` | Active question bank, demonstration question, structure-image mappings, ID generation, and shuffling |
| `types.ts` | Reaction, question, response, and local-record interfaces |
| `components/ReactionCard.tsx` | Reaction display and prediction controls |
| `components/ResultsView.tsx` | Score summary, participant CSV export, and DOI links |
| `components/AdminPanel.tsx` | Local record inspection, export, and resubmission |
| `components/mof_quest_demo.png` | README illustration |
| `metadata.json` | Application metadata and a separate question representation |
| `index.tsx` | React application entry point |
| `index.html` | HTML shell and external styling resources |
| `vite.config.ts` | Development server and build configuration |
| `package.json` | Dependencies and npm commands |

## Adapting MOF Quest for other quizzes

The MOF Quest interface can be adapted for other reaction-prediction tasks, materials-synthesis challenges, or confidence-based quizzes. Its randomized question presentation, confidence slider, scoring, and response exports provide a starting point for a new application.

To adapt the website:

1. **Replace the question dataset.** Update `successData` and `failData` in `constants.ts` with your own questions and reference outcomes. The application loads questions from this file; editing `metadata.json` alone does not change the quiz.

2. **Customize the question fields.** Modify the interfaces in `types.ts` and the display in `components/ReactionCard.tsx` to present the information relevant to your task. Replace the chemical structure previews with suitable images or remove them.

3. **Adjust the response options and scoring.** Edit the prediction controls in `components/ReactionCard.tsx` and the scoring logic in `App.tsx`. The current implementation supports binary outcomes with two confidence levels. Tasks with additional answer categories require corresponding changes to scoring, transcripts, and exports.

4. **Update the website content.** Revise the title, introduction, demonstration question, participant information, and results messages. Update `metadata.json` and any fixed references to MOF chemistry or a 22-question benchmark.

5. **Configure data collection.** Replace `GOOGLE_SCRIPT_URL` in `App.tsx` with your own backend endpoint and adapt the submission fields as needed. Update the participant disclosures to describe your study and its data-collection practices.

6. **Assign unique question identifiers.** Replace the chemistry-specific ID generator in `constants.ts` with identifiers appropriate for your dataset. Keep these identifiers stable across sessions so responses can be aligned despite randomized question order.

7. **Verify the complete participant flow.** Check the demonstration, question display, response options, scoring, final results, downloads, and backend submissions before distributing the quiz.


## Related research and citation

MOF Quest accompanies the study *Negative-Data Reasoning for Materials Discovery* and the broader [MOFinder repository](https://github.com/zzhenglab/MOFinder).


## Contributions and contact

Bug reports, documentation improvements, and corrections to reaction records are welcome through [GitHub Issues](https://github.com/zzhenglab/MOF-Quest/issues) or pull requests. For a reaction-data correction, include the affected question or reaction ID, source DOI, and evidence supporting the proposed change.

**Zheng Research Group**  
Department of Chemistry, Washington University in St. Louis  
[zhenglab.wustl.edu](https://zhenglab.wustl.edu/)  
Contact: [Zhiling Zheng](mailto:z.z@wustl.edu)

## Acknowledgments

We thank the chemists who contributed their time and expertise to the MOF Quest study. Initial application development was supported by Google AI Studio and Gemini. Chemical structure previews use resources provided by NCI/Cactus and PubChem.
