import { RiskLevel, RiskComponents, ExchangeAttribution } from '../types';
import { PatternMatchResult } from '../types';

export interface RiskExplanation {
  officerEnglish: string;
  officerHindi: string;
  victimEnglish: string;
  victimHindi: string;
}

export function generateRiskExplanation(params: {
  riskScore: number;
  severity: RiskLevel;
  riskComponents: RiskComponents;
  highRiskReasons?: string[];
  patternMatch?: PatternMatchResult | null;
  attribution?: ExchangeAttribution;
}): RiskExplanation {
  const { riskScore, severity, riskComponents, patternMatch, attribution } = params;

  const victimCount = patternMatch?.victimCount || 0;
  const stateList = patternMatch?.states.join(', ') || '';
  const totalInr = patternMatch?.totalAmount || 0;
  const formattedInr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalInr);

  const hasMixer = (riskComponents['Mixer Exposure'] || 0) > 40;
  const hasBridge = (riskComponents['Bridge Exposure'] || 0) > 40;
  const hasVelocity = (riskComponents['Velocity'] || 0) > 65;
  const hasClustering = (riskComponents['Address Clustering'] || 0) > 60;
  const hasExchange = (riskComponents['Exchange Proximity'] || 0) > 60 || (attribution && attribution.confidence > 50);
  const exchangeName = attribution?.exchange || 'a centralized exchange';

  // ─── 1. Officer Explanation (English) ───
  let officerEn = '';
  let officerHi = '';

  if (riskScore >= 80 || severity === 'Critical') {
    // Critical Risk (3-4 sentences)
    const factorPhrasesEn: string[] = [];
    const factorPhrasesHi: string[] = [];

    if (hasMixer) {
      factorPhrasesEn.push('moved funds through an OFAC-sanctioned privacy mixer to obscure the transaction trail');
      factorPhrasesHi.push('लेन-देन के निशान को छिपाने के लिए एक अनाम प्राइवेसी मिक्सर के माध्यम से धन स्थानांतरित किया');
    }
    if (hasBridge) {
      factorPhrasesEn.push('routed assets across multi-chain bridges to evade tracking');
      factorPhrasesHi.push('ट्रैकिंग से बचने के लिए संपत्तियों को विभिन्न ब्लॉकचेन नेटवर्क पर स्थानांतरित किया');
    }
    if (hasVelocity) {
      factorPhrasesEn.push('transferred funds within minutes of receipt (a common rapid-laundering signature)');
      factorPhrasesHi.push('प्राप्ति के कुछ ही मिनटों के भीतर धन स्थानांतरित कर दिया (त्वरित मनी लॉन्ड्रिंग का संकेत)');
    }

    const mainFactorsTextEn = factorPhrasesEn.length > 0
      ? ` It ${factorPhrasesEn.join(', ')}.`
      : ' It exhibits automated multi-wallet fund dispersal and rapid token swapping.';
    const mainFactorsTextHi = factorPhrasesHi.length > 0
      ? ` इसने ${factorPhrasesHi.join(', ')}।`
      : ' यह स्वचालित मल्टी-वॉलेट फंड वितरण और त्वरित टोकन ट्रांसफर प्रदर्शित करता है।';

    const patternTextEn = victimCount > 1
      ? ` Crucially, national intelligence links this exact address to ${victimCount} victims across ${stateList}, totaling ${formattedInr} in reported losses.`
      : ' This wallet is actively flagged for immediate compliance referral.';
    const patternTextHi = victimCount > 1
      ? ` मुख्य रूप से, राष्ट्रीय खुफिया प्रणाली इस पते को ${stateList} के ${victimCount} अन्य पीड़ितों से जोड़ती है, जिसमें कुल ${formattedInr} के नुकसान की रिपोर्ट है।`
      : ' इस वॉलेट को तत्काल अनुपालन कार्रवाई के लिए चिह्नित किया गया है।';

    const cexTextEn = hasExchange
      ? ` The stolen funds were swept into ${exchangeName} for liquidation, requiring an immediate freeze request.`
      : ' Immediate law enforcement escalation is strongly advised.';
    const cexTextHi = hasExchange
      ? ` चोरी की गई धनराशि निकासी के लिए ${exchangeName} में भेज दी गई है, जिसके लिए तत्काल संपत्ति फ्रीज अनुरोध आवश्यक है।`
      : ' तत्काल कानूनी और पुलिस कार्रवाई की सिफारिश की जाती है।';

    officerEn = `This wallet shows critical indicators of active financial fraud and organized money laundering.${mainFactorsTextEn}${patternTextEn}${cexTextEn}`;
    officerHi = `यह वॉलेट वित्तीय धोखाधड़ी और संगठित मनी लॉन्ड्रिंग के गंभीर संकेत दिखाता है।${mainFactorsTextHi}${patternTextHi}${cexTextHi}`;

  } else if (riskScore >= 65 || severity === 'High') {
    // High Risk (2-3 sentences)
    const factorEn: string[] = [];
    const factorHi: string[] = [];

    if (hasMixer) {
      factorEn.push('interacted with privacy mixing contracts');
      factorHi.push('प्राइवेसी मिक्सिंग कॉन्ट्रैक्ट्स का उपयोग किया है');
    }
    if (hasBridge) {
      factorEn.push('used cross-chain bridges to split asset flows');
      factorHi.push('संपत्ति के प्रवाह को विभाजित करने के लिए क्रॉस-चैन ब्रिज का उपयोग किया है');
    }
    if (hasClustering) {
      factorEn.push('operates within a cluster of interconnected burner wallets');
      factorHi.push('आपस में जुड़े कई माध्यमिक वॉलेट के नेटवर्क में काम करता है');
    }

    const factorStrEn = factorEn.length > 0 ? ` Specifically, it has ${factorEn.join(' and ')}.` : ' It displays high-velocity movement across secondary wallets.';
    const factorStrHi = factorHi.length > 0 ? ` विशेष रूप से, इसने ${factorHi.join(' और ')}।` : ' यह द्वितीयक वॉलेट के माध्यम से उच्च गति से धन का प्रवाह दिखाता है।';

    const patternTextEn = victimCount > 1
      ? ` National pattern matching confirms ${victimCount} prior victim complaints from ${stateList}.`
      : ' High-risk classification is driven by fast asset dispersal.';
    const patternTextHi = victimCount > 1
      ? ` राष्ट्रीय पैटर्न विश्लेषण ${stateList} से ${victimCount} पूर्व पीड़ित शिकायतों की पुष्टि करता है।`
      : ' उच्च जोखिम वर्गीकरण त्वरित संपत्ति हस्तांतरण से संचालित होता है।';

    officerEn = `This wallet displays high threat indicators associated with structured fraud.${factorStrEn}${patternTextEn}`;
    officerHi = `यह वॉलेट संरचित धोखाधड़ी से जुड़े उच्च खतरे के संकेत दिखाता है।${factorStrHi}${patternTextHi}`;

  } else if (riskScore >= 40 || severity === 'Medium') {
    // Medium Risk (2 sentences)
    const patternTextEn = victimCount > 0
      ? ` It has been linked to ${victimCount} prior complaint(s) in ${stateList}, warranting active monitoring.`
      : ' Funds were moved through secondary addresses shortly after ingestion, requiring close observation.';
    const patternTextHi = victimCount > 0
      ? ` इसे ${stateList} में ${victimCount} पूर्व शिकायत(ओं) से जोड़ा गया है, जिसकी निगरानी आवश्यक है।`
      : ' धन को प्राप्त होने के तुरंत बाद द्वितीयक पतों के माध्यम से स्थानांतरित किया गया था।';

    officerEn = `This wallet exhibits moderate risk flags that warrant officer monitoring.${patternTextEn}`;
    officerHi = `यह वॉलेट मध्यम जोखिम के संकेत दिखाता है जिनकी अधिकारी द्वारा निगरानी आवश्यक है।${patternTextHi}`;

  } else {
    // Low Risk (1 sentence)
    officerEn = `This wallet shows no major signs of illicit routing; transaction velocity and counterparty risk scores remain nominal.`;
    officerHi = `यह वॉलेट अवैध गतिविधियों का कोई बड़ा संकेत नहीं दिखाता है; लेन-देन की गति और जोखिम स्कोर सामान्य हैं।`;
  }

  // ─── 2. Victim Script (SMS / Call Script — Soft-toned & Jargon-free) ───
  let victimEn = '';
  let victimHi = '';

  if (riskScore >= 65) {
    victimEn = victimCount > 1
      ? `Hello, regarding your cyber fraud complaint: TraceGuard has tracked your reported wallet address. Our national system shows this wallet has been reported by ${victimCount} other victims across India. The funds were quickly moved to prevent recovery and routed toward an exchange account. We are issuing an emergency freeze request to help secure your funds.`
      : `Hello, regarding your cyber fraud complaint: Our team has analyzed the suspect wallet address. We detected rapid fund transfers designed to prevent recovery, routed toward a cryptocurrency exchange account. We are taking action to request an emergency asset hold.`;

    victimHi = victimCount > 1
      ? `नमस्ते, आपकी साइबर धोखाधड़ी की शिकायत के संबंध में: ट्रेसगार्ड ने आपके द्वारा बताए गए वॉलेट पते का पता लगा लिया है। हमारी प्रणाली से पता चलता है कि भारत भर में ${victimCount} अन्य पीड़ितों द्वारा भी इस वॉलेट की रिपोर्ट की गई है। पैसे वापस न मिल सकें, इसके लिए इसे तुरंत ट्रांसफर किया गया। हम आपके फंड को सुरक्षित करने के लिए इमरजेंसी फ्रीज अनुरोध भेज रहे हैं।`
      : `नमस्ते, आपकी शिकायत के संबंध में: हमारी टीम ने संदिग्ध वॉलेट पते का विश्लेषण किया है। हमने पाया कि पैसे जल्दी से दूसरी जगह भेजे गए। हम फंड को रोकने के लिए आपातकालीन कार्रवाई कर रहे हैं।`;
  } else if (riskScore >= 40) {
    victimEn = `Hello, regarding your complaint: Our team has analyzed the suspect wallet address you provided. We detected unusual fund movements and are actively tracking where the funds were transferred. We will update you as soon as further verification is completed.`;
    victimHi = `नमस्ते, आपकी शिकायत के संबंध में: हमारी टीम ने आपके द्वारा दिए गए संदिग्ध वॉलेट पते का विश्लेषण किया है। हमने असामान्य फंड ट्रांसफर का पता लगाया है और जांच कर रहे हैं। सत्यापन पूरा होते ही हम आपको सूचित करेंगे।`;
  } else {
    victimEn = `Hello, regarding your complaint: Our initial check of the reported wallet address is complete. We are actively monitoring this address for any further transfer activity.`;
    victimHi = `नमस्ते, आपकी शिकायत के संबंध में: रिपोर्ट किए गए वॉलेट पते की हमारी प्रारंभिक जांच पूरी हो गई है। हम आगे की गतिविधियों के लिए इस पते की निगरानी कर रहे हैं।`;
  }

  return {
    officerEnglish: officerEn.trim(),
    officerHindi: officerHi.trim(),
    victimEnglish: victimEn.trim(),
    victimHindi: victimHi.trim()
  };
}
