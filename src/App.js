import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Download } from 'lucide-react';
import { supabase } from './supabaseClient'

const questions = [
{ type:'style', text:"When the other side rejects my proposal outright, I tend to:", options:[
    {text:"Wonder what I can give up to keep the deal alive.",map:'yielder'},
    {text:"Pause and reassess my proposal before I say anything else.",map:'calculator'},
    {text:"Push back and explain why my position makes sense.",map:'dominator'},
    {text:"Ask them to explain what specifically is not working.",map:'integrator'},
]},

{ type:'style', text:"Before entering an important negotiation, I tend to:", options:[
    {text:"Consider what outcome would feel fair and workable on both sides.",map:'integrator'},
    {text:"Define the outcome I expect to secure.",map:'dominator'},
    {text:"Review my numbers and run through my tactics one more time.",map:'calculator'},
    {text:"Think about how to keep the interaction constructive and positive.",map:'yielder'},
]},

{ type:'style', text:"When my team is competing with another team for the same limited budget, I tend to:", options:[
    {text:"Analyse the expected returns to determine the most logical split.",map:'calculator'},
    {text:"Protect the working relationship even if it means accepting a smaller share.",map:'yielder'},
    {text:"Fight for the share my team needs to succeed.",map:'dominator'},
    {text:"Search for a structure that gives both teams what they actually need.",map:'integrator'},
]},

{ type:'shadow', text:"Before a negotiation begins, the other side shares something personal about their situation. I tend to:", options:[
    {text:"Listen politely but keep my focus on the business at hand.",shadow:false},
    {text:"Think how that detail could be useful for leverage later.",shadow:true},
    {text:"Share something personal back because real connection matters.",shadow:false},
    {text:"Acknowledge it briefly and steer back to the agenda.",shadow:false},
]},

{ type:'style', text:"When a negotiation reaches deadlock I tend to:", options:[
    {text:"Offer a small concession to restart momentum.",map:'yielder'},
    {text:"Push harder and add some pressure to break the deadlock.",map:'dominator'},
    {text:"Step back and reassess the facts before moving forward.",map:'calculator'},
    {text:"Ask questions to uncover what is really blocking agreement.",map:'integrator'},
]},

{ type:'style', text:"If the other side gets angry or raises their voice during a negotiation, I tend to:", options:[
    {text:"Slow the pace and refocus on the key facts.",map:'calculator'},
    {text:"Ease off the pressure point and find calmer ground.",map:'yielder'},
    {text:"Hold my position and make it clear that the terms are not changing.",map:'dominator'},
    {text:"Acknowledge what they are feeling and redirect toward the underlying concern.",map:'integrator'},
]},

{ type:'style', text:"When I realise I have significantly more leverage than the other side, I tend to:", options:[
    {text:"Hold back from using it because the relationship matters more than the margin.",map:'yielder'},
    {text:"Reassess what this really allows me to secure.",map:'calculator'},
    {text:"Use it to shape a win-win deal that works well for both sides.",map:'integrator'},
    {text:"Press my advantage to improve the outcome I want.",map:'dominator'},
]},

{ type:'shadow', text:"If I discover the other side has made a calculation error that works in my favour, I tend to:", options:[
    {text:"Point it out immediately because I want a clean deal.",shadow:false},
    {text:"Mention it to build trust and bank goodwill for later.",shadow:false},
    {text:"Keep quiet and act surprised if they ever notice.",shadow:true},
    {text:"Say nothing because checking their own numbers is their responsibility.",shadow:false},
]},

{ type:'style', text:"When a client asks me to deliver earlier than agreed and the issue is capacity not cost, I tend to:", options:[
    {text:"Ask what they actually need by the earlier date and whether a partial solution works.",map:'integrator'},
    {text:"Reorganise my priorities to accommodate them because the relationship matters.",map:'yielder'},
    {text:"Assess capacity limits and present realistic options based on the data.",map:'calculator'},
    {text:"Push back and remind them the original timeline was agreed for good reasons.",map:'dominator'},
]},

{ type:'style', text:"When the other side makes a small concession during a negotiation, I tend to:", options:[
    {text:"Consider what that concession really changes in the deal.",map:'calculator'},
    {text:"Thank them and offer a concession in return.",map:'yielder'},
    {text:"Note it and move straight to the next item I want to secure.",map:'dominator'},
    {text:"Build on it by suggesting a trade that moves us closer to agreement.",map:'integrator'},
]},

{ type:'style', text:"When negotiating with someone I will likely work with for years, I tend to:", options:[
    {text:"Negotiate just as firmly because the tone I set now shapes future interactions.",map:'dominator'},
    {text:"Examine the long term risk exposure before committing to any position.",map:'calculator'},
    {text:"Prioritise long term stability over short term gains.",map:'yielder'},
    {text:"Look for terms both sides can operate under sustainably.",map:'integrator'},
]},

{ type:'shadow', text:"When the other side clearly trusts me completely, I tend to:", options:[
    {text:"Treat the negotiation the same way regardless of how much they trust me.",shadow:false},
    {text:"Use that trust to quietly steer the outcome more in my favour.",shadow:true},
    {text:"Use that trust to move toward a deal that genuinely works for both sides.",shadow:false},
    {text:"Appreciate the trust and make sure I do not take advantage of it.",shadow:false},
]},

{ type:'style', text:"When a colleague asks for my advice before their negotiation, I tend to say:", options:[
    {text:"Build a positive relationship early because people share more when they feel respected.",map:'yielder'},
    {text:"Understand the other side's priorities so you can propose something creative.",map:'integrator'},
    {text:"Prepare your numbers thoroughly because the other side will challenge every claim.",map:'calculator'},
    {text:"Know exactly what you want and go get it.",map:'dominator'},
]},

{ type:'style', text:"When I am offered a deal that is acceptable but not ideal, I tend to:", options:[
    {text:"Benchmark it against my alternatives before committing.",map:'calculator'},
    {text:"Push for better terms because acceptable is not good enough.",map:'dominator'},
    {text:"Lock it in because a solid deal in hand has real value.",map:'yielder'},
    {text:"Propose targeted adjustments that could improve it for both sides.",map:'integrator'},
]},

{ type:'style', text:"When the other side tells me six months later that the agreed terms are not working for them, I tend to:", options:[
    {text:"Explore specific changes that could make it workable for both sides going forward.",map:'integrator'},
    {text:"Re-evaluate the original terms against the actual data from the last six months before responding.",map:'calculator'},
    {text:"Hold firm because re-negotiating sets a precedent I do not want.",map:'dominator'},
    {text:"Look for ways to help them because the ongoing partnership matters.",map:'yielder'},
]},

{ type:'style', text:"When I discover the other side has been dishonest about something important, I tend to:", options:[
    {text:"Pause and reassess the risks before responding.",map:'calculator'},
    {text:"Raise it with them directly and state my expectations.",map:'dominator'},
    {text:"Contain the issue so it does not derail the deal.",map:'yielder'},
    {text:"Raise it transparently and redirect toward honest terms.",map:'integrator'},
]},

{ type:'shadow', text:"When I am close to agreement and know the other side would accept less than what is currently on the table, I tend to:", options:[
    {text:"Lock in the current terms quickly before anything changes.",shadow:false},
    {text:"Hint that I have other options to see if they sweeten the deal even though I do not.",shadow:true},
    {text:"Close at the current terms because they are already good for me.",shadow:false},
    {text:"See how much further I can move them before they push back.",shadow:false},
]},

{ type:'style', text:"When the person across the table is clearly less experienced than me, I tend to:", options:[
    {text:"Follow the same process and preparation I would use with anyone.",map:'calculator'},
    {text:"Reduce my intensity because it does not feel right to take advantage of them.",map:'yielder'},
    {text:"Adjust my approach and explore whether there is value for both sides.",map:'integrator'},
    {text:"Stay focused on getting what I want regardless of their experience level.",map:'dominator'},
]},

{ type:'style', text:"When the other side introduces a new demand late in the negotiation, I tend to:", options:[
    {text:"Challenge it and push back firmly.",map:'dominator'},
    {text:"Explore what is behind the new demand before reacting.",map:'integrator'},
    {text:"Adjust something on my side to keep the deal going.",map:'yielder'},
    {text:"Pause and evaluate how it affects the overall deal.",map:'calculator'},
]},

{ type:'shadow', text:"When I secure a great deal but the other side looks disappointed, I tend to:", options:[
    {text:"Review my notes to check whether the outcome was actually fair.",shadow:false},
    {text:"Think, it is not my problem because a deal is a deal.",shadow:false},
    {text:"Reassure them they got a great deal too even though I know they did not.",shadow:true},
    {text:"Feel genuinely bad and wonder if I pushed too hard.",shadow:false},
]},

{ type:'style', text:"After closing a negotiation, I tend to think:", options:[
    {text:"I hope we're still on good terms.",map:'yielder'},
    {text:"What specifically did I do well that I can repeat next time?",map:'calculator'},
    {text:"Could I have got more?",map:'dominator'},
    {text:"Will this agreement hold up for both of us?",map:'integrator'},
]},
];
const stylePrimary = {
  dominator: "You lead with power and assertiveness. In any negotiation, your first instinct is to establish control, set the terms, and drive toward the outcome you want. You are direct, decisive, and completely unafraid of confrontation. Where others see conflict as something to avoid, you see it as the fastest route to clarity.\n\nDominators are the closers of the negotiation world. When a deal needs to get done, when someone needs to make a tough call, when the room has stalled and everyone is dancing around the issue, you are the one who cuts through. You say what others are thinking. You push when others hesitate. You never leave value on the table simply because you feel too polite to ask for it.\n\nYour competitive nature delivers strong results in the short term, but it can blind you to relational dynamics that matter over time. Not every negotiation is a single encounter. Many are rounds in a relationship that spans years or even decades. The Dominator's greatest asset is courage and conviction. The Dominator's greatest risk is isolation, because pushing too hard and too often means people eventually stop wanting to sit across from you.",
  integrator: "You lead with strategy and collaboration. Your natural instinct is to understand the full landscape before making your move, asking what each side truly needs, where there is overlap, and how the deal can be structured so everyone walks away with something meaningful. You are not naive about competition, but you believe the best outcomes come from creative problem solving rather than brute force.\n\nIntegrators are the deal architects of the negotiation world. Where Dominators fight over a fixed pie, you are asking whether the pie can be made bigger. You look for creative trades, package deals, and solutions that address underlying interests rather than surface positions. This approach consistently produces better total outcomes for all parties involved.\n\nYour collaborative nature is genuine, not performative. You actually care whether the other side gets a fair deal, not because you are soft, but because you understand that people who feel respected come back, refer others, and implement agreements willingly. The Integrator's greatest asset is vision and strategic depth. The Integrator's greatest risk is excessive optimism, because not everyone shares your values, and some will exploit your openness without hesitation.",
  yielder: "You lead with relationships and empathy. Your natural instinct in any negotiation is to build rapport, find common ground, and ensure everyone feels heard and respected. Conflict makes you uncomfortable, not because you cannot handle it, but because you genuinely believe better outcomes come from harmony than from fighting.\n\nYielders are the relationship builders of the negotiation world. You create environments where people feel safe enough to be honest about what they really need. This is a genuinely powerful skill. More information leads to better deals, and people share more with someone they trust. Your warmth is not weakness. It is a sophisticated negotiation tool that harder styles simply cannot replicate.\n\nHowever, your instinct to accommodate can work against you. When you give ground to maintain harmony, you are often sacrificing your own interests without realising it. The concessions feel small in the moment but they compound over time. The Yielder's greatest asset is trust and emotional intelligence. The Yielder's greatest risk is self sacrifice, because you are so focused on the other person's experience that you forget to advocate for your own needs.",
  calculator: "You lead with analysis and preparation. Before any negotiation, your instinct is to gather data, build models, map scenarios, and understand every variable at play. You trust evidence over intuition, process over personality, and logic over emotion.\n\nCalculators are the strategists of the negotiation world. You arrive more prepared than anyone else at the table. You have read the contract, checked the market rates, modelled the alternatives, and calculated your walk away point with precision. This preparation gives you a genuine edge, because you see things others miss, catch errors others overlook, and make decisions grounded in reality rather than wishful thinking.\n\nYour analytical nature, however, can create distance between you and the people across the table. While you are processing data, others are reading the room. While you are building spreadsheets, relationships are forming without you. The Calculator's greatest asset is preparation and rigour. The Calculator's greatest risk is detachment, because you can be so focused on the analysis that you forget to connect with the person sitting opposite you.",
};

const styleSecondary = {
  dominator: "Your Dominator secondary adds steel to your approach. When pushed, you do not fold. You push back. This competitive undercurrent means you are unlikely to be exploited, and you have the assertiveness to claim value when it matters most. Be careful though, because under pressure this energy can emerge more aggressively than you intend, undermining the trust your primary style has built. The key is deploying this steel deliberately rather than letting it erupt reactively when emotions take over.",
  integrator: "Your Integrator secondary adds strategic depth to your approach. You do not just react to what is in front of you. You look for creative solutions and consider the long term implications of every move. This collaborative undercurrent helps you find deals others miss and tempers any aggressive tendencies with genuine problem solving. The risk is occasional overthinking when decisiveness would serve you better. But when you get the balance right, this secondary influence makes your primary style significantly more effective.",
  yielder: "Your Yielder secondary adds warmth and emotional intelligence to your approach. You read people well, care about relationships beyond the transaction, and bring a human quality that puts others at ease. This softer undercurrent helps you build trust quickly and makes others comfortable being honest with you, which means you get better information than negotiators who lack this quality. The risk is that under pressure, this gentle side can cause you to concede when holding firm would produce a better outcome. Learning to manage this instinct is essential to your development.",
  calculator: "Your Calculator secondary adds analytical rigour to your approach. You back up your instincts with data, prepare thoroughly, and rarely walk into a negotiation without doing your homework first. This methodical undercurrent gives you confidence grounded in evidence rather than hope, and it helps you spot opportunities and risks that others miss entirely. The risk is retreating into analysis when the moment calls for decisive action or emotional connection. Using data as a shield rather than a tool is the pattern to watch for.",
};

const archetypes = {
'dominator-integrator': {
    name:'The Conqueror', emoji:'⚔️', tagline:'You fight hard and you fight smart.',
    narrative:"The Conqueror is one of the most formidable negotiation profiles. You combine the Dominator's competitive drive with the Integrator's strategic intelligence, meaning you do not just want to win. You want to win in a way that is sustainable and smart. You push hard for your interests, but you are perceptive enough to know when to pivot, when to concede a small point to gain a large one, and when to leave something on the table for the sake of a future deal. When you walk into a negotiation, the other side pays attention, and they prepare accordingly.",
    strengths:"Powerful combination of assertiveness and strategic thinking that makes you effective across a wide range of negotiation contexts. You push hard but know when to pivot, and people take you seriously from the moment you sit down at the table. Your competitive instinct means you rarely leave value unclaimed, while your strategic side ensures you do not burn bridges unnecessarily. You excel in complex, high stakes negotiations where both toughness and creativity are required. You can read the room, spot opportunities in the deal structure, and move decisively to capture them, which is a rare combination that few negotiators can match.",
    weaknesses:"Your competitive fire can overshadow your collaborative instincts at the table, even when collaboration would produce a better deal. You genuinely believe you are being fair, but your version of fair tends to be skewed in your favour more often than you realise. You set the terms, frame the options, and define what reasonable looks like, and while it is skilful negotiation, the other side can feel managed rather than partnered. Over time, counterparts may agree to your deals but resent the process that produced them. Your strength can also make it hard for you to recognise when a softer approach at the table would actually produce a superior outcome for everyone involved.",
    blindSpots:"You assume every counterpart respects strength and strategic thinking as much as you do, but that is simply not the case. Some people across the table shut down under pressure, meaning you miss information they would have shared willingly in a less competitive negotiation environment. You also underestimate how much your intensity affects counterparts emotionally, even when you believe you are being perfectly reasonable. You think you are being direct and efficient, but they may experience you as domineering or overwhelming. The deals you are proudest of may be the ones your counterparts are most bitter about, which creates long term risks to future negotiations that you cannot see from your side of the table.",
    howOthersSeeYou:"Impressive but intimidating at the table. People respect your competence and preparation, but they do not always enjoy negotiating with you. Less experienced counterparts find you overwhelming, while peers see you as a worthy adversary they need to prepare carefully for. Those who have negotiated with you before appreciate your reliability and directness, but newcomers often feel they are fighting uphill from the first offer. You command attention in any negotiation, and the real question is whether that attention comes with trust or with wariness.",
    underPressure:"When stressed, your Dominator side takes over and your strategic patience erodes quickly. The collaborative intelligence of the Integrator gives way to competitive aggression, and you may push harder on terms than the situation warrants. You become more focused on winning the point than finding the best deal, which can derail otherwise productive negotiations. The transition can be sudden, catching the other side off guard. One moment you are exploring options together, the next you are competing aggressively, and the other side feels ambushed by the shift in your approach.",
    watchOut:"Winning today's deal while losing tomorrow's relationship is the trap that Conquerors fall into most often. If counterparts remember being conquered, they come back armed next time, or they simply do not come back at all. Your track record of strong results may mask the relationships you are quietly eroding beneath the surface. Pay attention to whether people choose to negotiate with you, or whether they deal with you only because they have no alternative. The difference matters more than most Conquerors realise, and it determines whether your negotiation success is truly sustainable over time.",
    growthEdge:"Ask one more question before making your move in every negotiation you enter. Practice genuine curiosity by asking about the other side's constraints, pressures, and priorities before presenting your own position. You will be surprised how much more information flows when you lead with questions rather than demands. The best Conquerors win because people choose to deal with them, not because the other side had no choice. Your strategic brain can handle this shift, so let it guide you toward a more sustainable and ultimately more profitable approach to every deal you negotiate.",
    growthSteps:[
      'Before stating your position, ask about the other side\'s constraints and priorities',
      'Notice when you are pushing out of habit rather than strategy and pause',
      'After every negotiation, ask yourself whether the other side would choose to deal with you again',
    ],
  },
  'dominator-yielder': {
    name:'The Iron Chancellor', emoji:'🏛️', tagline:'Iron fist, velvet glove.',
    narrative:"The Iron Chancellor is a fascinating contradiction. Fierce competitiveness is wrapped in genuine warmth. You can drive a hard bargain while making the other person feel respected and heard. This is a rare and powerful combination because people trust you even while you are pushing them, and they often agree to terms they would reject from a pure Dominator. The tension between these two sides, however, means you are constantly navigating an internal tug of war that can make you unpredictable.",
    strengths:"Rare blend of toughness and warmth that catches people off guard and gives you a distinctive edge at the table. You drive hard bargains without making enemies, and your genuine empathy helps you read the room in ways that pure competitors simply cannot. People let their guard down around you because your warmth is real and not performed. This gives you access to information and goodwill that more aggressive negotiators never see. You can push hard on substance while maintaining the relationship, which is a skill most negotiators spend their entire careers trying and failing to master.",
    weaknesses:"Internal tug of war between winning and being liked makes you inconsistent in ways that undermine your effectiveness. In one meeting you are tough and direct, in the next you are accommodating and flexible, and neither you nor your counterpart can predict which version will show up. This unpredictability can breed uncertainty rather than trust over time. People do not know which Chancellor they are getting, and that ambiguity works against you more often than you realise. Building consistency into your approach would significantly amplify your natural talents.",
    blindSpots:"You switch between Dominator and Yielder modes based on emotion rather than strategy, and this pattern is more visible to others than you think. When you like someone, the Yielder takes over and you concede too much without realising it. When you feel disrespected, the Dominator emerges with disproportionate force that can damage relationships quickly. You are not choosing your approach deliberately. Your feelings are choosing for you, and that is a vulnerability that experienced negotiators will spot and exploit systematically over time.",
    howOthersSeeYou:"Charming and capable, but sometimes confusing to those who deal with you regularly. People enjoy your company but are not always sure where they stand with you at any given moment. Your warmth makes them feel safe, but your competitive moments can feel like betrayals of that warmth. Those who know you well learn to read which mode you are in and adjust accordingly. Those who do not may feel manipulated even when you are being entirely genuine in your intentions.",
    underPressure:"Under pressure, one of two things happens, and neither is strategic. Either your Dominator side takes over and you become aggressively competitive, losing the relational goodwill you have carefully built, or your Yielder side dominates and you accommodate simply to make the discomfort stop. The shift is driven by adrenaline rather than analysis, which means you are at your least effective precisely when the stakes are highest. Your task under pressure is to pause and consciously choose which energy the situation actually requires. Recognising the trigger before it takes hold is the critical skill you need to develop.",
    watchOut:"The perception of manipulation is your greatest reputational risk, even when your intentions are entirely honest. Because you are warm and tough in alternation, some people will conclude you are being strategically nice to soften them up for the kill. Even if that is not your intention, the pattern can look exactly that way from the outside. Once someone decides you are manipulative, every warm gesture becomes suspect and every tough moment confirms their theory. Consistency is your antidote, and it matters more than charm ever will.",
    growthEdge:"Choose your mode intentionally before each negotiation rather than letting the moment decide for you. Ask yourself whether this situation needs your Dominator energy or your Yielder warmth, then commit to that approach and stay there throughout. Consistency builds more trust than charm ever will, and deliberate flexibility is far more powerful than reactive switching between extremes. Your dual nature is genuinely a gift, but only when you control it instead of it controlling you. Start practising this deliberate choice in low stakes situations first, and build the habit before the pressure rises.",
      growthSteps:[
      'Before each negotiation, decide deliberately whether to lead with warmth or firmness',
      'Commit to that approach for the entire conversation rather than switching based on emotion',
      'Practice this deliberate choice in low stakes situations before testing it under pressure',
    ],
  },
  'dominator-calculator': {
    name:'The Inquisitor', emoji:'🔍', tagline:'Prepared, precise, and relentless.',
    narrative:"The Inquisitor combines competitive drive with analytical depth. You do not just want to win. You want to win on the evidence. You arrive at every negotiation armed with data, precedents, and carefully constructed arguments. Your approach is systematic and thorough, and you have a gift for finding the weakness in any position. People who come unprepared to negotiate with you are in for a very uncomfortable experience. Those who come prepared will find a worthy and formidable counterpart.",
    strengths:"Analytical rigour meets competitive drive, making you exceptionally well prepared and extremely hard to outmanoeuvre at the table. You arrive armed with data, spot weaknesses others miss, and build arguments that are genuinely difficult to counter. Your preparation gives you real confidence, not bluster, but the quiet certainty that comes from knowing your position is sound. In complex, technical, or high value negotiations you are truly formidable. When the stakes are high and the details matter, there is nobody you would rather have on your side of the table.",
    weaknesses:"You can come across as cold, clinical, and interrogating, which creates defensiveness in the people sitting opposite you. Your focus on data and logic means you often dismiss emotional or relational factors as noise, but those factors drive decisions just as much as facts do. People feel cross examined rather than engaged in a genuine conversation, and this makes them guarded and resistant. Guarded people hide information, dig into positions, and fight harder, which is the opposite of what you need for a good outcome. Your brilliance at analysis can actually make the negotiation harder when it is not paired with interpersonal skill.",
    blindSpots:"You believe that being right is enough, but it is not, and this blind spot costs you more than you realise. You undervalue the emotional dimension of negotiation, specifically how people feel about you, about the process, and about the outcome. A deal that is objectively fair but feels adversarial will face implementation problems, renegotiation attempts, and relationship damage. Data tells you what to do, but emotion tells you whether it will actually work in practice. Ignoring half the equation does not make you rational. It makes you incomplete as a negotiator.",
    howOthersSeeYou:"Respected but feared by those who have sat across from you before. People acknowledge your competence and preparation openly, but they do not look forward to sitting opposite you. You ask uncomfortable questions, challenge assumptions relentlessly, and rarely let anything slide past you. Colleagues value having you on their side of the table, while opponents wish you were on theirs instead. But few would describe the experience of negotiating with you as pleasant, and some will avoid it entirely if they can find an alternative.",
    underPressure:"Under pressure, you retreat further into analysis and become more rigid in your positions. You want more data, more time, and more certainty before committing to anything, and when you cannot get those things you become adversarial. Your Dominator side asserts itself with sharp, clinical attacks on the other side's position that feel personal even when they are not intended that way. You win the argument but lose the room in the process. The combination of increased aggression and decreased warmth under pressure is your most dangerous and most predictable pattern.",
    watchOut:"Being right does not mean people will agree with you, and this is a lesson that many Inquisitors learn too late. If the other party feels disrespected by your clinical approach, they may walk away from a good deal just to spite you. Your thoroughness can also create a power imbalance that makes less prepared counterparts feel humiliated rather than persuaded. Victory through humiliation creates enemies, not partners, and enemies have very long memories. The resistance you encounter is often a reaction to your style rather than your substance.",
    growthEdge:"Add warmth to your precision and watch your effectiveness multiply. A single genuine question about the other person, their challenges, their pressures, what keeps them up at night, can unlock more value than an hour of data analysis. Try opening your next negotiation with curiosity about the person before diving into the problem at hand. Your analytical skills are already world class and do not need more sharpening. Your relational skills are where the real growth lies, and even small improvements there will dramatically increase your overall effectiveness.",
      growthSteps:[
      'Open your next negotiation with a genuine question about the person before discussing the problem',
      'Watch how the conversation changes when you lead with curiosity rather than data',
      'Ask yourself after each meeting whether the other side felt respected, not just logically persuaded',
    ],
  },
'integrator-dominator': {
    name:'The King', emoji:'👑', tagline:'You lead with vision and backbone.',
    narrative:"The King is the most commanding presence at any negotiation table. You combine the Integrator's collaborative vision with the Dominator's competitive backbone, meaning you genuinely seek outcomes that work for everyone, but you are absolutely willing to fight for your position when necessary. People defer to your proposals because you project both fairness and strength in equal measure. You set the tone, frame the agenda, and guide the conversation with a confidence that feels earned rather than imposed. When you walk into a negotiation, the other side adjusts their approach to match yours.",
    strengths:"Natural authority combined with genuine collaborative intent makes you one of the most effective negotiation profiles in any setting. You seek fair outcomes but are not afraid to fight for what matters, which earns deep respect from counterparts on both sides of the table. Your combination of vision and steel means you can hold a room, manage multiple stakeholders, and drive toward deals that are both ambitious and achievable. People trust your proposals because they serve the collective interest, not just your own. In multi party negotiations and complex deal structures, you are the one everyone looks to for direction and resolution. You consistently close deals that others cannot because you combine the creativity to find solutions with the backbone to push them through.",
    weaknesses:"Your confidence in your own proposals can tip into rigidity more easily than you expect, particularly when you are under time pressure. When your ideas are challenged at the table, your Dominator side may emerge more aggressively than you intended, and your certainty that you have found the best deal structure, because you have considered everyone's interests, can make you dismissive of alternatives you have already evaluated and rejected. You negotiate well, but you do not always listen well, and there is a fine line between guiding a negotiation toward a good outcome and controlling the conversation so tightly that the other side feels managed rather than partnered. That line is thinner than you think, and others see you cross it more often than you realise.",
    blindSpots:"You believe your proposals are best because you have considered everyone's interests, but the question is whether you have really listened to what the other side needs or just assumed you already know. Your confident, decisive style can crowd out quieter counterparts and unconventional ideas that might actually improve the deal. The people most likely to offer you information you do not already have are the ones least likely to speak up when you are dominating the conversation. You may not even notice their silence, which means you are negotiating with incomplete information while believing you have the full picture. This gap between your perception and reality is your most significant vulnerability at the table.",
    howOthersSeeYou:"Commanding and fair, but sometimes overbearing in ways you do not intend. People genuinely respect your proposals and often defer to your framing of the deal, sometimes too readily for the good of the outcome. But some counterparts experience your approach as steamrolling dressed up as collaboration, and they resent it quietly. They agree to your terms because challenging you feels futile, not because they are genuinely persuaded the deal is fair. The agreement you see on the surface may be thinner than you think, and it may not survive the pressures of implementation when the other side reflects on how little input they actually had.",
    underPressure:"Under pressure, the Dominator emerges and your collaborative patience erodes quickly. Your strategic thinking gives way to competitive instinct, and you begin making unilateral demands, issuing ultimatums, and pushing terms through rather than building agreement. The transition can be sudden and jarring for counterparts who trusted your collaborative approach and expected it to hold. They feel blindsided by the shift, and the trust you have built across the table can evaporate in a single heated exchange. Learning to recognise the early warning signs of this pattern is essential to maintaining your effectiveness in tough negotiations.",
    watchOut:"The moment the other side feels you are dictating terms rather than collaborating on a deal, you lose the trust that makes you effective. Negotiators who stop listening to counterparts eventually become adversaries, and the difference between the two is often invisible to the person doing the talking. Watch for signs that the other side is agreeing to your proposals to end the conversation rather than because they genuinely support the terms. Compliance at the table is not commitment to the deal, and the gap between the two will show up during implementation. The strongest negotiators actively invite pushback because they understand that challenge makes deals better and more durable.",
    growthEdge:"Practice genuine curiosity by asking questions you do not already know the answer to at the negotiation table, and sit with the answers before responding with your own proposal. Invite pushback explicitly, not as a token gesture, but because the best deals are built when both sides genuinely contribute to the structure. In your next negotiation, let the other side propose the first solution and resist the urge to improve it immediately. Your negotiation outcomes are strongest when the other side feels they chose the deal, not when they feel they had no alternative but to accept yours.",
    growthSteps:[
      'In your next negotiation, let the other side propose the first solution before presenting your own',
      'When your proposal is challenged, ask a question before defending your position',
      'After every deal, ask yourself whether the other side would describe the process as collaborative or controlled',
    ],
  },
'integrator-yielder': {
    name:'The Ambassador', emoji:'🤝', tagline:'Trusted by everyone at the table.',
    narrative:"The Ambassador is the most trusted profile in the negotiation world. You combine the Integrator's strategic collaboration with the Yielder's genuine warmth, creating an approach that makes counterparts feel safe, heard, and respected at the table. Others open up to you naturally, sharing information and concerns they would hide from more competitive negotiators. You find creative deal structures because people tell you what they really need, not just what they are willing to say in a formal negotiation.",
    strengths:"Exceptional at building trust and finding deal structures everyone feels good about, which gives you a distinctive advantage in relationship heavy negotiations. Your warmth is genuine, your strategic thinking is sharp, and the combination means you consistently find deals that others miss entirely. Counterparts actively want to negotiate with you because they believe the process will be fair. They implement agreements willingly because they feel ownership over the outcome, and they come back for future deals with confidence. In long term, relationship heavy negotiations where repeat business matters, you are simply unmatched at the table.",
    weaknesses:"You avoid necessary confrontation at the table, even when pushing harder would serve everyone's interests better in the long run. When the deal requires you to hold a firm position, draw a clear line, or walk away, you hesitate because the potential damage to the relationship feels too costly. The thought of creating tension at the table makes you genuinely uncomfortable, and this discomfort leads to concessions that serve the relationship at the expense of the deal. Over time, you leave significant value on the table, not because you lack intelligence, but because you lack the willingness to create the temporary tension that better deals require. Recognising this pattern is the first step toward changing it.",
    blindSpots:"You assume good faith too readily and extend trust to counterparts faster than the evidence warrants. Not everyone across the table shares your collaborative values, and some negotiators will exploit your openness, use your trust against you, and take advantage of your reluctance to confront dishonesty in a deal. Your warm, open style is a magnet for manipulation by those who see kindness as weakness at the negotiation table. Your instinct to see the best in every counterpart can delay your recognition of bad faith tactics until significant damage to the deal has already been done. Trust should be earned incrementally and verified regularly, not given freely on the assumption that the other side operates as you do.",
    howOthersSeeYou:"Warm, trustworthy, and genuinely liked by almost everyone who negotiates with you. Counterparts enjoy the process and often feel the outcomes are fair, which is a real and valuable asset. However, tougher negotiators may view you as a soft target they can push without consequence at the table. They appreciate your nature but exploit it when it serves their deal interests. Your own stakeholders may wish you came back with stronger terms, even if they admire the relationships you build with counterparts along the way.",
    underPressure:"Under pressure at the table, your Yielder side dominates completely and your strategic thinking goes offline. You become conflict averse, accommodating, and focused on preserving the relationship at any cost, even when that cost means accepting deal terms that are unreasonable. You make concessions you will regret once the pressure subsides and you can evaluate the deal clearly again. You need preset boundaries, meaning lines drawn before you walk into the negotiation, because in the moment your instinct is always to give ground. Writing down your walk away point before every negotiation is not optional for you. It is essential.",
    watchOut:"Dominators and manipulators read your warmth as weakness and will test you at the table accordingly. Without steel underneath your diplomacy, you will consistently give away more value than you should and more than your stakeholders expect from the deal. The hardest lesson for Ambassadors is that firmness and warmth are not opposites at the negotiation table. You can say no with a smile, hold your position with empathy, and protect your deal interests without damaging the relationship. Most counterpart relationships are far more resilient than you assume, and they can handle the occasional firm boundary in a negotiation.",
    growthEdge:"Practice saying no at the table without apologising, starting in low stakes negotiations and building from there. Hold a position longer than feels comfortable and observe what happens to the deal. You will usually find that counterparts respect the boundary and the relationship survives perfectly well. Firm boundaries delivered with warmth is your ultimate negotiation superpower, but you need to actually deploy it rather than just knowing it exists. Before every concession, ask yourself this: am I giving this because it is strategic for the deal, or because I am uncomfortable with the tension at the table?",
    growthSteps:[
      'Before every concession, ask yourself whether you are giving it because it is strategic or because you are uncomfortable',
      'Practice saying no without apologising, starting in low stakes negotiations',
      'Write down your walk away point before walking in and hold at least one position firm',
    ],
  },
'integrator-calculator': {
    name:'The Vizier', emoji:'🎯', tagline:'Three moves ahead of everyone.',
    narrative:"The Vizier is the master negotiation strategist. You combine the Integrator's collaborative problem solving with the Calculator's analytical depth, creating an approach that sees further into the deal structure and thinks deeper about the terms than any other profile. You do not just prepare for the negotiation. You prepare for every possible direction it could take. You anticipate counterpart moves, map deal scenarios, and build proposals that are creative, robust, and genuinely hard to fault. You are the person everyone wants advising them before they walk into a tough negotiation.",
    strengths:"Strategic mastermind who sees the full deal picture and plans several moves ahead of everyone else at the table. You build proposals that are both creative and bulletproof, combining genuine collaboration with rigorous analysis in a way that few other negotiation profiles can match. Your proposals are consistently better thought through than anyone else's, backed by both logic and a genuine understanding of all parties' deal interests. In complex, multi party negotiations with many moving parts, you are genuinely invaluable at the table. The deals you build tend to last because they are designed to withstand changing circumstances and implementation pressures over time.",
    weaknesses:"You can overthink deal structures and under act at the table, and this pattern costs you more negotiation outcomes than you realise. While you are planning the perfect proposal, opportunities pass and faster moving counterparts claim the value you were still analysing. Your need for thoroughness creates delays that frustrate the other side, and your reluctance to commit to terms until you have analysed every angle can look like indecisiveness or lack of conviction at the table. Sometimes a good deal closed today beats a perfect deal structure next week, and you struggle deeply with that truth. Learning to commit to terms at eighty percent certainty rather than waiting for ninety five is your most important development area as a negotiator.",
    blindSpots:"You trust your preparation process more than your instincts at the table, and sometimes the right move in a negotiation is obvious and does not need a spreadsheet to justify it. Your analytical nature can also make you dismissive of gut feelings, both yours and your counterpart's, which means you miss signals at the table that cannot be quantified but are nonetheless critically important to the deal. Not everything that matters in a negotiation can be measured, and not every deal term improves with more analysis. The counterparts sitting across from you sometimes know things intuitively about the deal that your models cannot capture. Learning to value and integrate that intuitive information alongside your analytical data would make you significantly more effective at the table.",
    howOthersSeeYou:"Brilliant but slow at the table, which creates a perception gap that varies dramatically depending on who you are negotiating with. Counterparts respect your intellect and the quality of your proposals, but they often get frustrated waiting for them. Fast moving negotiators feel held back by your process and may disengage or close with someone else before you are ready to present your carefully crafted deal structure. Detail oriented counterparts love negotiating with you because they appreciate your rigour. The perception gap between those who value thoroughness and those who value speed at the table often determines how effective you are in any given negotiation.",
    underPressure:"Under pressure at the table, you retreat into analysis and demand more time, more data, and more certainty before committing to any terms. If pushed beyond your comfort zone by aggressive counterparts, you become rigid about process, insisting on proper review when the negotiation demands flexibility and speed. Your Integrator side wants to find a creative deal structure. Your Calculator side will not let you commit until you have verified it from every angle. The result is paralysis at the worst possible moment in the negotiation, precisely when decisive action is most needed to capture value on the table.",
    watchOut:"Analysis paralysis is a real and present danger for you at the table, and competitive negotiators know how to use your need for information against you by creating artificial time pressure on the deal. They know that if they rush you, you will either make a worse decision than usual or freeze entirely, and both outcomes serve their deal interests. Have a framework ready for rapid decisions at the table, not perfect decisions, but good enough decisions you can make under pressure without abandoning your values. Preparation for speed is just as important as preparation for substance in any negotiation.",
    growthEdge:"Set a decision deadline for yourself before every negotiation and honour it regardless of whether you feel completely ready to commit to terms. Practice making deal decisions at eighty percent certainty instead of waiting for ninety five, and observe how the outcomes compare. The value of a timely decision at the table almost always exceeds the value of a perfect one that arrives too late. Your analytical and collaborative negotiation skills are already world class. Your speed of execution at the table is where the real growth lies, and it is the one thing holding you back from being truly exceptional as a negotiator.",
    growthSteps:[
      'Set a decision deadline before every negotiation and honour it regardless of whether you feel completely ready',
      'Practice committing to deal terms at eighty percent certainty and observe how the outcomes compare',
      'When you want more data, ask yourself whether the additional analysis would actually change the terms you offer',
    ],
  },
  'yielder-dominator': {
    name:'The Shield Bearer', emoji:'🛡️', tagline:'Gentle until provoked, then formidable.',
    narrative:"The Shield Bearer is the negotiation world's dark horse. You lead with warmth, empathy, and a genuine desire for harmony, but underneath that gentle exterior lies real steel. When pushed too far, when your values are violated, or when someone you care about is threatened, you transform. The shift catches people off guard because they have been negotiating with the Yielder and suddenly find themselves facing the Dominator. It is effective once, but the question is whether you can access that strength before you have already given away too much.",
    strengths:"Deceptively resilient in ways that consistently surprise the people sitting opposite you. You lead with warmth but dig in hard when it matters, and people underestimate you at their peril. Your initial gentleness creates trust and openness, allowing you to gather information and build rapport before the negotiation gets truly tough. When it does get tough, you have reserves of assertiveness that surprise counterparts who mistook your kindness for weakness. You are also fiercely protective of your team and your values, which makes you a powerful advocate when the cause matters to you.",
    weaknesses:"Your default is accommodation, and it takes significant provocation to activate your tougher side, which means you often give ground unnecessarily long before you ever consider pushing back. The threshold for switching from Yielder to Dominator is set far too high for your own good. By the time you assert yourself, you have already conceded important points that are difficult or impossible to recover. Your strength exists, but it activates too late and too inconsistently to be reliably useful. Learning to lower that threshold is the single most important thing you can do to improve your negotiation outcomes.",
    blindSpots:"You wait too long to assert yourself, and by the time you push back, you have already given away too much ground to recover your position. You also do not realise how jarring the switch is for others who have calibrated to your gentle style and feel blindsided when the Dominator appears. This inconsistency can actually damage trust more than being firm from the start would have. People prefer predictable toughness to unpredictable eruptions, even if the eruption is justified. Your pattern of patience followed by a sudden hard stance creates confusion rather than respect.",
    howOthersSeeYou:"Initially warm and easy to work with, the kind of person people genuinely enjoy negotiating with and look forward to seeing. But those who have triggered your Dominator side remember it vividly and tell others about the experience. The contrast between your normal gentleness and your provoked toughness can feel like a betrayal of character, even though both sides are genuinely you. Over time, people who know you learn to respect your boundaries and avoid crossing them. But newcomers will always test those limits because your default warmth gives no indication of the steel beneath.",
    underPressure:"Under pressure, you oscillate between over accommodation and disproportionate pushback in a pattern that undermines both your relationships and your results. You absorb, absorb, and absorb some more, and then you snap. The snap is usually bigger than the situation requires because you are responding to accumulated frustration, not just the current provocation. This pattern is your most important one to recognise and manage, because it costs you credibility and trust every time it occurs. Learning to release pressure incrementally rather than in a single burst is the key to transforming this pattern.",
    watchOut:"Experienced negotiators test limits early, and if you fold on the first three requests, they know you will fold on the fourth and the fifth as well. Your pattern of accommodation followed by sudden resistance creates an exploitable predictability that skilled counterparts will recognise and use against you. They push until you snap, then back off just enough to keep you in Yielder mode for the next round of requests. Dominators in particular will read you quickly and systematically work your pattern to extract maximum concessions. Recognising this dynamic from outside yourself is the first step toward breaking free of it.",
    growthEdge:"Set your non negotiables before you walk in and write them down where you can see them during the conversation. Know your lines in advance so you do not have to find them under pressure when your instincts are pulling you toward accommodation. Practice early, small assertions by pushing back on the first issue rather than waiting until the tenth when your frustration is already building. You have both the warmth and the steel inside you. Your task is integrating them into a consistent approach rather than alternating between extremes that confuse everyone, including yourself.",
    growthSteps:[
      'Write your three non-negotiables down before every negotiation where you can see them',
      'Push back on the first issue rather than waiting until frustration builds',
      'Build your assertiveness muscle by pushing back on small everyday requests before testing it in high stakes situations',
    ],
  },
  'yielder-integrator': {
    name:'The Emissary', emoji:'📜', tagline:'You build bridges others cannot.',
    narrative:"The Emissary is the natural peacemaker and bridge builder. You combine the Yielder's warmth and empathy with the Integrator's strategic collaboration, creating an approach that excels at finding common ground even in the most difficult situations. People trust you instinctively, and you use that trust to build solutions that genuinely serve everyone involved. You are at your best in relationship heavy, long term, or emotionally complex negotiations where other styles struggle and founder.",
    strengths:"Genuine relationship builder with strategic awareness that allows you to turn goodwill into smart, lasting agreements. You create trust naturally, find common ground effortlessly, and have the strategic thinking to convert that goodwill into deals that actually work for everyone involved. People open up to you, share their real concerns, and work with you to find solutions because they believe you genuinely care about their interests. And you do, which is precisely why it works so consistently. You see opportunities for mutual gain that more adversarial styles miss entirely, and you bring a calming presence that helps everyone at the table think more clearly.",
    weaknesses:"You prioritise harmony over outcomes and may agree to terms that feel good in the moment but cost you significantly in the long run. Your desire for positive relationships means you are reluctant to have difficult conversations, push for better terms, or walk away from a deal that is not good enough. The result is a pattern of agreements you feel warm about but that your stakeholders wish were stronger. Over time, this pattern erodes your credibility with the people you represent, even as it strengthens your relationships with the people across the table. Recognising the gap between feeling good about a deal and actually achieving a good deal is essential to your growth.",
    blindSpots:"You confuse compromise with collaboration more often than you realise, and the distinction matters enormously. Splitting the difference feels fair but often means neither side gets what they really need. True collaboration means finding creative solutions that serve both sides, and sometimes that requires uncomfortable conversations about priorities, trade offs, and what you are genuinely not willing to give up. You tend to skip those conversations in favour of quick, comfortable middle ground that looks fair but actually leaves significant value unclaimed. Building the discipline to stay in discomfort longer would dramatically improve your outcomes.",
    howOthersSeeYou:"Lovely to deal with, but sometimes too accommodating for your own good and for the good of those you represent. People genuinely like you and feel respected by you, which is a real and valuable asset in any negotiation context. But tougher counterparts may see you as someone they can push without fear of consequence. Your own stakeholders may wish you came back with stronger results, even though they appreciate your relationships. The warmth that makes you effective in building relationships can make you predictable and therefore exploitable when it comes to protecting your interests.",
    underPressure:"Under pressure, your Yielder side dominates completely and your strategic Integrator thinking goes offline just when you need it most. You become focused on ending the discomfort as quickly as possible, which usually means making concessions that solve the immediate tension but create long term problems. You agree to things you will question later when you have the space to think clearly again. Having clear walk away criteria written down before the negotiation is essential for you because it keeps your strategic brain engaged when your emotional brain wants to please. Without those written boundaries, you are negotiating against yourself.",
    watchOut:"Your likability is a genuine asset, but it is not a strategy by itself, and confusing the two is dangerous. Tough negotiators will enjoy your company while they systematically claim everything on the table without you noticing until it is too late. Being liked does not protect your interests. Being clear about your needs does, even when clarity creates temporary discomfort. Make sure every act of warmth is paired with clarity about what you need from the deal, because warmth without boundaries is an open invitation for exploitation.",
    growthEdge:"Before every concession, ask yourself this question: am I giving this because it is strategic, or because I am uncomfortable with the tension? If the answer is discomfort, hold your ground and observe what happens. Practice sitting with silence after making a request instead of filling the gap with a softer version of what you just asked for. Your warmth will survive one firm moment, and the relationship is almost certainly more resilient than you fear. Build the habit of pausing before conceding, because most of the time you will discover that the tension passes entirely on its own.",
    growthSteps:[
      'Before giving a concession, pause and count to five before responding',
      'Ask yourself whether the tension you feel is real danger or just discomfort',
      'Hold your position on one point longer than feels comfortable and observe what happens',
    ],
  },
  'yielder-calculator': {
    name:'The Counsel', emoji:'📖', tagline:'The quiet voice everyone should listen to.',
    narrative:"The Counsel is the most insightful profile in the negotiation world, and also the most underestimated. You combine the Yielder's empathy and people reading ability with the Calculator's analytical depth, meaning you understand both the numbers and the humans behind them. You see patterns others miss, anticipate problems before they materialise, and have the emotional intelligence to navigate complex interpersonal dynamics with grace. Your only problem is that you rarely assert any of this forcefully enough to shape the outcome in your favour.",
    strengths:"Thoughtful, perceptive, and deeply knowledgeable in ways that consistently surprise people when they take the time to listen. You notice things others miss entirely, from emotional undercurrents to logical inconsistencies to hidden opportunities buried in complexity. Your combination of empathy and analysis gives you a uniquely complete picture of any negotiation that few other profiles can match. People who listen to you make better decisions, and you bring a calming, grounding presence to tense situations that helps everyone think more clearly. Your insight is genuinely rare and genuinely valuable whenever it reaches the table.",
    weaknesses:"Extremely risk averse and conflict avoidant in ways that significantly limit your impact at the negotiation table. You would rather observe than engage, sitting on insights that could change the entire direction of the deal because sharing them might create confrontation or put you in the spotlight. Your analysis is excellent but your execution is weak, and the gap between the two is where your potential goes unrealised. You prepare beautifully and then underperform at the table because asserting yourself feels deeply uncomfortable. The world only benefits from your insight when you actually share it.",
    blindSpots:"You over prepare and under execute, and you have convinced yourself this is wisdom rather than avoidance, but it is not. You tell yourself you are being thoughtful when you are actually being timid, and the distinction matters enormously. The insight you are holding back, because it might be wrong, might cause conflict, or might draw unwanted attention to you, is usually the most important thing anyone in the room could say. Your silence has a cost, and you are not accounting for it in your analysis. Every time you hold back, the negotiation proceeds without your best contribution, and everyone at the table loses as a result.",
    howOthersSeeYou:"Quiet, knowledgeable, and pleasant, but often invisible in exactly the moments when your insight would be most valuable. People appreciate your contributions when you make them but forget to seek your input because you do not demand it or signal its availability. More assertive styles talk over you, assume your silence means agreement, and move forward without the benefit of your analysis. This is not entirely their failure. You need to make your value visible rather than waiting for others to discover it, because most of them are too busy with their own concerns to go looking.",
    underPressure:"Under pressure, you withdraw psychologically even when you remain physically present in the room. You become quieter, more analytical, and less engaged with the people around you, retreating into your notes, your data, and your preparation, all the things that feel safe. Meanwhile, the negotiation moves forward without you, and others make the decisions you should be influencing. Your absence from the conversation at critical moments is your biggest vulnerability. The higher the stakes, the more you retreat, which is exactly the opposite of what the situation requires.",
    watchOut:"Knowledge without assertiveness is wasted potential, and every other style at the table will outpace you if you do not speak up. Dominators will dominate the conversation, Integrators will lead the process, Yielders will at least try to build rapport and influence the tone, and you will sit there with the best analysis in the room watching everyone else make suboptimal decisions because you did not contribute. Your insight only has value when it reaches the table. Keeping it inside your head protects you from discomfort but deprives everyone else of your genuine contribution. The cost of your silence is borne by everyone, not just you.",
    growthEdge:"Share your insights out loud, every single time, not just when asked directly. Make a commitment to speak up at least fifty percent more than feels comfortable in your next negotiation and observe what happens to the quality of the discussion. Prepare not just your analysis but your talking points, writing down what you want to say and when you want to say it during the conversation. Your analysis is a powerful tool, but only if you use it actively rather than keeping it in reserve. Start treating your voice as part of your preparation rather than an optional addition that depends on whether someone invites you to speak.",
    growthSteps:[
      'Prepare one specific insight you will share out loud in your next negotiation',
      'Write down not just your analysis but the exact words you will use to present it',
      'Speak up at least once before being asked and notice how people respond',
    ],
  },
  'calculator-dominator': {
    name:'The Spymaster', emoji:'🗡️', tagline:'Patient, precise, and lethal.',
    narrative:"The Spymaster is the most dangerous profile at the table, not because you are aggressive, but because you are calculated. You combine the Calculator's analytical patience with the Dominator's competitive drive, creating an approach that gathers intelligence, waits for the right moment, and strikes with surgical precision. You rarely make the first move, but when you do move, it is decisive and perfectly timed. People who underestimate your patience do so at their peril.",
    strengths:"Lethal combination of patience and competitiveness that makes you exceptionally effective in high stakes, complex negotiations with sophisticated counterparts. You gather information others overlook, wait for openings others miss, and execute with a precision others simply cannot match. Your analytical preparation means you understand the terrain better than anyone else at the table, and your competitive drive means you exploit that understanding fully when the moment arrives. You are the chess player at a table of checkers players, thinking several moves ahead while others react to what is immediately in front of them. In negotiations where information is power and timing is everything, you are in your element.",
    weaknesses:"Perceived as cold, calculating, and untrustworthy by those who sense your approach even when they cannot quite articulate what makes them uneasy. Your patience looks like plotting, your analysis looks like surveillance, and your precision looks like manipulation, even when your intentions are entirely legitimate. People who feel studied do not open up, which creates a painful irony at the heart of your style. The more deliberately you try to gather intelligence, the less people are willing to share with you freely. Your very method of building advantage can undermine the information flow you depend on.",
    blindSpots:"You wait so long for the perfect moment that you miss good ones, and this pattern of perfectionism disguised as patience costs you more than you realise. Not every negotiation requires a masterplan, and not every counterpart is an adversary to be outmanoeuvred rather than a partner to collaborate with. Your default assumption that information is power can make you hoard rather than share, creating a dynamic where both sides operate with incomplete pictures and reach worse outcomes than necessary. The irony is that your strategic intelligence is sophisticated enough to recognise this, but your competitive instinct overrides that recognition in the moment. Learning to distinguish between negotiations that require your full Spymaster approach and those that need something simpler would significantly improve your results.",
    howOthersSeeYou:"Impressive when people see you work, but unsettling in how you work, which creates a complicated reputation over time. Counterparts sense they are being studied even when they cannot articulate why, and this awareness makes them guarded and cautious. Once your approach is understood, and experienced negotiators will understand it quickly, people become more careful around you. They share less, position more carefully, and treat every interaction as potentially strategic. This guarded dynamic is the opposite of what produces truly good deals for both sides.",
    underPressure:"Under pressure, your Dominator side takes over with cold precision that can feel ruthless to those on the receiving end. You become sharply competitive, using your analytical advantage as a weapon rather than a tool for finding mutual benefit. Your moves become more aggressive, your patience thins dramatically, and your strikes become more pointed and personal. This pressurised version of you is effective in the short term but burns trust rapidly and creates adversaries who will remember the experience. The damage you do under pressure often takes far longer to repair than the advantage it creates.",
    watchOut:"When people figure out your approach, and experienced negotiators will figure it out, they stop sharing information entirely and your power base erodes. Your effectiveness depends on access to intelligence, and that access evaporates once you are identified as a calculating competitor who uses information strategically against others. The Spymaster's greatest vulnerability is exposure, because once people know what you are, they build walls where there used to be doors. The reputation you build follows you from one negotiation to the next, and in close industries, word travels fast. Your future effectiveness depends on how you manage your current reputation.",
    growthEdge:"Show more of your hand deliberately and observe how the dynamic changes. Selective transparency, meaning sharing some of your analysis, your reasoning, and your constraints openly, actually generates better intelligence than secrecy because people naturally reciprocate openness with openness. In your next negotiation, share one piece of genuine information early and watch how the conversation shifts. Trust, strategically deployed, is more powerful than secrecy, and you are strategic enough to deploy it brilliantly. The transition from information hoarder to selective sharer is the single most impactful change you can make to your negotiation approach.",
    growthSteps:[
      'Share one piece of genuine information early in your next negotiation',
      'Watch how the other side\'s openness changes in response to your transparency',
      'Ask yourself whether secrecy is truly serving you or just making others guard against you',
    ],
  },
  'calculator-integrator': {
    name:'The Architect', emoji:'🏗️', tagline:'You build deals that stand the test of time.',
    narrative:"The Architect is the master deal builder. You combine the Calculator's analytical rigour with the Integrator's collaborative creativity, producing agreements that are technically sound, strategically robust, and genuinely fair to all parties involved. Your deals do not just close. They last. They survive implementation challenges, changing circumstances, and the test of time. You may not be the fastest or the most charismatic negotiator in the room, but the structures you build consistently outlast everyone else's.",
    strengths:"Deep analysis combined with genuine collaboration produces agreements that everyone can live with over the long term, and that is rarer than most people realise. You understand both the technical details and the human dynamics, and you weave them together into proposals that are creative, fair, and genuinely robust. Your thoroughness means your deals have fewer surprises, fewer renegotiations, and fewer breakdowns during implementation. In complex, multi stakeholder negotiations with many moving parts, you are the most valuable person at the table. The agreements you produce tend to outlast those built by faster, more aggressive negotiators because your foundations are stronger.",
    weaknesses:"Slow and methodical to a fault, which creates friction with counterparts who operate at a faster pace. Fast moving negotiations and aggressive counterparts can leave you behind while you are still mapping variables and building your analysis. Your need for thoroughness creates delays that test others' patience and sometimes cost you opportunities that close before you are ready. Your desire to build the perfect deal can prevent you from closing a genuinely good one. The gap between your preparation timeline and others' decision speed is a consistent source of friction, frustration, and missed opportunities.",
    blindSpots:"You value elegance and completeness over speed, and you have built a comfortable narrative that careful analysis is always better than quick decisions, but that is not always true. Sometimes an imperfect deal done quickly beats a perfect deal that never gets closed because the window of opportunity passed while you were still refining your model. You also underestimate how much your deliberative style frustrates counterparts who operate on instinct and speed. They see your thoroughness as obstruction rather than value, and they may disengage from the process before you are ready to present your carefully crafted solution. Recognising when speed matters more than precision would make you significantly more effective.",
    howOthersSeeYou:"Thorough, fair, and sometimes maddeningly slow, which creates very different impressions depending on who you are working with. People who value quality and durability love working with you and seek you out for important negotiations. People who value speed and decisiveness find you frustrating and may avoid working with you on time sensitive matters. Your reputation for solid, lasting deals earns you genuine respect over the long term. But in the immediate moment, counterparts may feel stuck in a process that moves at your pace rather than theirs, and that perception can cost you opportunities.",
    underPressure:"Under pressure, you cling to process with an intensity that can feel obstructive to everyone else in the room. You insist on proper analysis, thorough review, and structured decision making when the situation may demand flexibility, improvisation, and speed. If your process is disrupted by time pressure, aggressive counterparts, or unexpected developments, you become rigid and anxious rather than adaptive and creative. The very structure that gives you strength in calm conditions becomes a cage under pressure. Building comfort with imperfect information and rapid decisions is your most critical development area.",
    watchOut:"Competitive negotiators exploit your need for structure by creating chaos, because disrupting your process is the fastest way to neutralise your advantage. If they can rush your timeline, introduce unexpected variables, or force you out of your prepared framework, they push you into reactive mode where you are at your weakest and most vulnerable. Always have a contingency approach ready for when your primary plan is disrupted, because it will be disrupted eventually. The best Architects design for earthquakes, not just fair weather. Prepare for the process breaking down just as thoroughly as you prepare for it working perfectly.",
    growthEdge:"Build a good enough threshold into every preparation before you walk in the door. Define clearly what eighty percent of your ideal outcome looks like, and decide in advance whether you would accept it if offered. This gives you a decision point that prevents endless optimisation and allows you to close deals while the opportunity is still available. Practice closing deals that are good rather than holding out for deals that are perfect, and observe how the outcomes compare over time. Your architecture skills are already exceptional. Now build a clock into your blueprints and watch your effectiveness increase dramatically.",
   growthSteps:[
      'Define clearly what eighty percent of your desired outcome looks like before every negotiation',
      'If offered that eighty percent, commit to accepting it rather than optimising further',
      'Practice closing deals that are good rather than holding out for deals that are perfect',
    ],
  },
  'calculator-yielder': {
    name:'The Oracle', emoji:'🔮', tagline:'You see everything. Now act on it.',
    narrative:"The Oracle has the deepest insight of any profile. You combine the Calculator's analytical power with the Yielder's emotional intelligence, giving you a complete understanding of both the data and the people involved. You see dynamics others miss, anticipate problems before they surface, and understand motivations at a level that borders on intuitive. Your challenge is not perception. It is action. You see what needs to happen but struggle to make it happen, because acting means risking conflict, exposure, and the discomfort of asserting yourself in front of others.",
    strengths:"Deeply empathetic and extraordinarily perceptive in ways that consistently reveal things others miss entirely. You understand people and situations at a level most negotiators never reach, regardless of how many years of experience they accumulate. Your combination of analytical and emotional intelligence means you see the complete picture, including the numbers, the relationships, the hidden agendas, and the unspoken concerns that drive real decisions. Your insight is genuinely rare, and when you do share it, it fundamentally changes how people think about the problem. You are the advisor everyone needs and few know to ask for, which is both your gift and your limitation.",
    weaknesses:"You observe and advise but struggle to lead, preferring to support someone else's negotiation rather than take the reins yourself. This means your exceptional insight often goes unused or gets filtered through less capable people who dilute or misunderstand it. You have all the information needed to be outstanding at the table, but you cannot bring yourself to sit at the head of it. This is not humility, despite how it might feel from the inside. It is a limitation that costs you influence, outcomes, and the recognition your insight genuinely deserves.",
    blindSpots:"Your passivity is not wisdom. It is avoidance dressed up as patience and thoughtfulness, and it is important that you recognise the difference. You tell yourself you are being measured, strategic, and considerate, but underneath those comfortable labels is a simple fear. Fear of conflict, of being wrong publicly, of asserting yourself in a way that might be challenged or rejected by others. This fear costs you deals, opportunities, and the influence your insight genuinely deserves. The label you put on your avoidance does not change its nature or reduce its cost.",
    howOthersSeeYou:"Insightful but passive, which creates a frustrating paradox for the people around you who recognise your value. People who know you well seek your counsel before big negotiations and value your perspective enormously. But at the table itself, you fade into the background when your voice is needed most. More assertive styles dominate the conversation while you sit with better ideas and deeper understanding, contributing only when directly asked and sometimes not even then. Your invisibility is not imposed on you by others. It is something you create through your own reluctance to step forward.",
    underPressure:"Under pressure, you disappear, not physically, but psychologically, becoming quieter, more analytical, and less engaged with the people in the room. You retreat into observation and analysis, contributing less and less as the stakes rise around you. At the exact moment when your insight is most valuable and most needed, you become least likely to share it. This pattern makes you unreliable in high pressure negotiations and limits the roles and opportunities available to you. Others learn that they cannot count on your voice when it matters most, which means they stop seeking it out.",
    watchOut:"Every other style at the table will outpace you if you do not find the courage to speak up and contribute actively. Dominators will take control of the conversation, Integrators will lead the process toward solutions, Yielders will at least build rapport and try to influence the emotional tone of the room, and you will sit there with the best understanding in the room watching suboptimal outcomes unfold because you chose silence over discomfort. Your silence is not neutrality. It is a choice, and it has real consequences for everyone at the table, including yourself. The cost of not speaking is always higher than you estimate in the moment.",
    growthEdge:"You have more power and more influence than you think, and the gap between your potential and your performance is entirely within your control to close. Make one firm statement or request in every negotiation, just one, not a question and not a suggestion, but a clear assertion of what you believe or what you need. Then build the muscle from there over time. Your insight combined with even moderate assertiveness would make you one of the most effective negotiators in any room you enter. The only thing standing between you and that reality is your willingness to speak up, tolerate the discomfort that follows, and discover that the consequences you fear almost never actually materialise.",
    growthSteps:[
      'Make one firm statement in your next negotiation that is not a question or a suggestion',
      'Prepare your talking points in advance including the exact moment you will share them',
      'Build the muscle by adding one more assertion each negotiation until it feels natural',
    ],
  },
};

const shadowLevels = [
  {title:'Clean Conscience',sub:'No shadow detected',color:'green',
    msg:"You answered every shadow question with transparency and integrity. What people see is what they get when they deal with you, and that is a genuine competitive advantage. This builds the kind of deep, structural trust that compounds over time into better deals, stronger relationships, and a reputation that opens doors before you even walk through them. In a world full of people playing games, your straightforwardness is rarer and more valuable than you might think. Protect this quality fiercely, because once lost it is almost impossible to rebuild."},
  {title:'Faint Shadow',sub:'A slight tendency detected',color:'green',
    msg:"You are overwhelmingly honest and transparent, but there was one moment where a less straightforward option appealed to you. This is entirely human and does not indicate a problem. Almost everyone has situations where the expedient path tempts them briefly. What matters is the overall pattern, and yours is strongly weighted toward integrity. Stay aware of the moments where convenience whispers louder than principle, because those are the moments that define your long term reputation."},
  {title:'Minor Shadow',sub:'Occasional strategic flexibility with the truth',color:'yellow',
    msg:"You are mostly authentic, but there are moments where you bend the truth, withhold key information, or mask your real agenda when it feels convenient. It is subtle enough that most people will not notice the pattern yet, but you should be aware that these tendencies grow stronger under pressure. What starts as a small omission or a harmless misdirection becomes a pattern of strategic dishonesty over time, and patterns eventually become visible to those who pay attention. The most dangerous negotiation habit is the one you do not acknowledge, because you cannot manage what you refuse to see."},
  {title:'Emerging Pattern',sub:'A noticeable tendency toward strategic deception',color:'yellow',
    msg:"A clear pattern is forming. You are comfortable using information selectively, presenting a carefully managed version of yourself, and allowing others to operate on assumptions you know to be incomplete or incorrect. You probably tell yourself this is just smart negotiation, and in isolated instances you might be right. But three out of seven shadow indicators suggest this is becoming a default approach rather than a situational choice. The gap between who you present yourself as and how you actually operate is wide enough that perceptive counterparts will eventually notice it. The question is whether you close that gap voluntarily or wait until someone closes it for you."},
  {title:'The Mask Slips',sub:'A significant pattern of manipulation',color:'amber',
    msg:"You have a well developed pattern of presenting one face while operating with a different agenda underneath. You are likely winning short term gains through this approach, whether by hiding information, feigning warmth to extract concessions, or engineering situations where others act on incomplete or misleading information you have provided. But people talk, and reputations travel faster than you do in every industry. Four out of seven shadow indicators is not a grey area. It is a clear pattern that experienced negotiators will recognise, discuss with colleagues, and prepare defences against. The trust you burn today is leverage you will never have access to tomorrow."},
  {title:'The Shadow Deepens',sub:'Strong manipulative tendencies detected',color:'red',
    msg:"Your results reveal a consistent and deliberate approach to manipulation. You exploit trust, fabricate or distort information, and manage perceptions in ways designed to extract advantage while maintaining a surface appearance of fairness. This is not occasional or situational. Five of seven shadow indicators pointed to the same pattern. Here is the difficult truth. Experienced negotiators have met people who operate this way before, and they have defences ready. They share less, verify more, and build protective clauses into agreements specifically because of people who negotiate the way you do. Your approach has an expiry date, and it is closer than you think."},
  {title:'Dark Pattern',sub:'Deeply ingrained deceptive approach',color:'red',
    msg:"Six out of seven shadow questions revealed a pattern of deliberate deception, trust exploitation, and strategic manipulation. You consistently choose the path that extracts maximum advantage while maintaining plausible deniability, and you have likely been doing it long enough that it feels normal to you. It is not normal. It is a deeply ingrained habit that is costing you far more than you realise in lost trust, damaged relationships, and opportunities that never materialise because people warn each other about working with you. Senior negotiators, experienced buyers, and anyone who has been burned before will see through this approach faster than you expect. The question is not whether this catches up with you. It already has, in ways you probably cannot see from your current vantage point."},
  {title:'Deep Shadow',sub:'Pervasive manipulation across every indicator',color:'red',
    msg:"Every single shadow question pointed to the same pattern. You consistently choose manipulation over authenticity, deception over honesty, and the appearance of fairness over the reality of it. You see other people's openness as opportunity, their trust as a tool, and their goodwill as something to be harvested rather than reciprocated. This is not strategy. It is a fundamental orientation toward other people that will eventually isolate you professionally and personally. Every relationship you build on this foundation has a fracture line running through it, and the pressure required to break it gets smaller over time. Rebuilding trust is ten times harder than building it, so start now before the cost becomes unrecoverable. The skills behind this pattern are real and could be redirected toward building genuine influence that would make you formidable for all the right reasons."},
];

const styleLevels = {
  dominator: {
    negligible: "Competitive tactics are almost entirely absent from your negotiation approach. You rarely push back on terms, seldom anchor aggressively, and are unlikely to escalate when challenged at the table. You prefer other methods to reach agreement. This is not necessarily a weakness, but it means you may struggle to claim value when the deal genuinely requires assertiveness. If the other side pushes hard, you are unlikely to match their energy, which can result in leaving significant value on the table without realising it.",
    low: "You have some competitive instincts but they sit deep beneath the surface and rarely drive your behaviour at the table. You can push back when absolutely necessary, but it takes a lot of provocation to get there. Most counterparts will never see this side of you because your other negotiation tendencies activate long before your competitive instinct does. In deals where the other side is assertive, you may find yourself gradually giving ground rather than holding your position, not because you agree with their terms but because matching their energy feels unnatural to you.",
    moderate: "You have real competitive ability but it is not your default at the negotiation table. In most deals you defer to other approaches first. However, when pushed or when the stakes rise, your Dominator traits emerge and you become noticeably more assertive about terms. You are capable of pushing hard for what you want but it is not where you naturally start. This means you sometimes miss early opportunities to anchor strongly or set ambitious terms because your competitive instinct activates later in the conversation rather than from the opening position.",
    high: "Competition is a strong and visible part of how you negotiate. You push for favourable terms naturally, hold your ground under pressure, and are comfortable making the first offer and setting ambitious anchors. Counterparts notice your assertiveness early and adjust their approach accordingly. You rarely leave value on the table through timidity. The risk at this level is that your competitive energy can overshadow your other negotiation skills, making it harder to build the trust and rapport that complex deals often require.",
    dominant: "Competition is your natural state at the negotiation table. You instinctively push for the best possible terms, set the pace of every conversation, and resist concessions with genuine intensity. Every other style in your profile is filtered through this competitive lens first. This is not a mode you switch into when needed. It is where you live. Your counterparts know within minutes that they are dealing with someone who will fight for every point. This delivers strong short term results consistently, but it can make counterparts reluctant to negotiate with you again or share information openly.",
  },
  integrator: {
    negligible: "Collaborative and creative deal making is largely absent from your negotiation approach. You rarely explore underlying interests, seldom propose package deals or creative trades, and are unlikely to spend time understanding what the other side truly needs beyond their stated position. You tend to treat negotiations as straightforward exchanges of offers and counteroffers rather than opportunities to create additional value. This means you may consistently reach agreements that are acceptable but miss significantly better outcomes that a more exploratory conversation could have produced.",
    low: "You have some collaborative instincts but they rarely shape your behaviour at the table. You can engage in creative problem solving when someone else initiates it, but you are unlikely to lead the conversation in that direction yourself. When a deal stalls, your first instinct is not to explore new structures or look for creative trades. It is to push harder on existing terms or concede to move things forward. This means the value creating potential of most negotiations goes largely untapped when you are at the table.",
    moderate: "You have genuine collaborative ability that shows up in certain negotiation contexts but is not your consistent default. When you are comfortable with the counterpart or when the deal structure naturally invites creativity, you explore interests, propose trades, and look for mutual gains effectively. But under pressure or with difficult counterparts, this instinct retreats and your other styles take over. The collaborative deals you do build tend to be good ones. The question is whether you access this skill consistently enough to benefit from it across all your negotiations.",
    high: "Collaboration and creative deal making are a strong and visible part of how you negotiate. You naturally ask about underlying interests, propose package structures, and look for ways to expand the value available to both sides before dividing it. Counterparts find you genuinely engaged with their needs, not just your own, and this earns you access to information that more competitive negotiators never see. You consistently find deals that others miss because you are willing to invest time in understanding the full picture.",
    dominant: "Creative collaboration defines how you negotiate. Your first instinct in any deal is to understand interests, explore options, and build structures that create value for both sides. You see negotiations as joint problem solving exercises rather than competitive encounters, and this shapes every conversation you have at the table. Counterparts trust your process and share information willingly because they believe you genuinely care about their outcome. The risk is that your collaborative orientation can blind you to counterparts who are exploiting your openness.",
  },
  yielder: {
    negligible: "Relationship preservation and accommodation play almost no role in how you negotiate. You do not soften your position to maintain rapport, rarely worry about how the other side feels about the terms, and are unlikely to make concessions simply to keep the atmosphere positive. You focus on the deal substance rather than the interpersonal dynamic. This gives you clarity and efficiency at the table, but it also means you may miss opportunities that come from building genuine warmth with counterparts.",
    low: "You have some awareness of relationship dynamics at the table but they rarely drive your negotiation decisions. You can be warm and accommodating when it costs you nothing, but when the deal terms are at stake you prioritise substance over rapport without much hesitation. Counterparts may find you professional but not particularly warm, and they are unlikely to feel a strong personal connection with you after the negotiation.",
    moderate: "Relationships and harmony play a real but secondary role in your negotiations. You care about how counterparts feel and you make genuine efforts to keep interactions positive, but you can set those concerns aside when the deal requires it. You make some concessions to maintain rapport that a harder negotiator would not, but you do not give away the deal to keep everyone happy. This balance serves you well in most contexts.",
    high: "Maintaining positive relationships is a strong and visible priority in how you negotiate. You invest real energy in rapport, monitor how counterparts feel throughout the process, and adjust your approach to keep interactions comfortable and constructive. You are willing to sacrifice some deal value to preserve a relationship you believe matters long term. Counterparts genuinely enjoy negotiating with you, which gives you repeat business and referrals that harder negotiators never see.",
    dominant: "Relationships are the lens through which you see every negotiation. Your first priority is always the interpersonal dynamic, and deal terms come second. You will accept significantly worse terms rather than create tension with a counterpart you value, and you will make concessions that serve no strategic purpose simply to make the other side feel good about the process. Learning to separate your genuine care for people from your negotiation decisions is essential.",
  },
  calculator: {
    negligible: "Analysis and preparation play almost no role in your negotiation approach. You rarely research the other side, seldom build detailed positions in advance, and are unlikely to reference data or benchmarks during the conversation. You rely on instinct, relationships, or sheer force of will rather than evidence. This means you may miss important details in deal terms and agree to terms you would have rejected if you had done the homework.",
    low: "You do some preparation before negotiations but it is not thorough or consistent. You may review the key numbers and have a general sense of what you want, but you are unlikely to have modelled alternatives, researched the other side's constraints, or built a detailed walk away position. At the table, you rely on your other skills more than evidence.",
    moderate: "Analysis and preparation are a real part of your negotiation approach but not your defining feature. You do your homework on important deals, reference data when it supports your position, and can hold your own in detailed discussions about terms and benchmarks. However, you are equally comfortable making decisions based on instinct or relationship dynamics when the data is inconclusive.",
    high: "Thorough preparation and analytical rigour are a strong and visible part of how you negotiate. You arrive at the table with detailed research, clear benchmarks, modelled alternatives, and a precise understanding of your walk away position. Counterparts notice your preparation quickly and it earns you credibility and respect. You catch errors others miss and make decisions grounded in reality rather than hope.",
    dominant: "Analysis defines how you negotiate. You do not sit down at the table without thorough research, detailed models, and a comprehensive understanding of every variable at play. You trust evidence over intuition, process over personality, and logic over emotion in every deal. Your preparation gives you a genuine and consistent edge because you see things others miss.",
  },
};

const getStyleLevel = (score) => {
  if (score <= 1) return 'negligible';
  if (score <= 3) return 'low';
  if (score <= 6) return 'moderate';
  if (score <= 9) return 'high';
  return 'dominant';
};

const levelLabels = {
  negligible: { text: 'Negligible', color: '#94A3B8', bg: 'bg-gray-100', barWidth: '6%' },
  low: { text: 'Low', color: '#64748B', bg: 'bg-gray-200', barWidth: '25%' },
  moderate: { text: 'Moderate', color: '#3B82F6', bg: 'bg-blue-100', barWidth: '50%' },
  high: { text: 'High', color: '#F59E0B', bg: 'bg-amber-100', barWidth: '75%' },
  dominant: { text: 'Dominant', color: '#EF4444', bg: 'bg-red-100', barWidth: '100%' },
};

const styleMeta = {
  dominator:{label:'Dominator',color:'#DC2626',tw:'text-white',bg:'bg-red-600',light:'bg-red-600',border:'border-red-600',barColor:'#DC2626',
    brief:'The competitive negotiator who leads with assertiveness, sets ambitious terms, and pushes to win.'},
  integrator:{label:'Integrator',color:'#9333EA',tw:'text-white',bg:'bg-purple-600',light:'bg-purple-600',border:'border-purple-600',barColor:'#9333EA',
    brief:'The collaborative negotiator who explores interests, builds creative deals, and seeks value for both sides.'},
  yielder:{label:'Yielder',color:'#16A34A',tw:'text-white',bg:'bg-green-600',light:'bg-green-600',border:'border-green-600',barColor:'#16A34A',
    brief:'The relationship focused negotiator who prioritises harmony, builds trust, and maintains rapport at the table.'},
  calculator:{label:'Calculator',color:'#2563EB',tw:'text-white',bg:'bg-blue-600',light:'bg-blue-600',border:'border-blue-600',barColor:'#2563EB',
    brief:'The analytical negotiator who leads with data, preparation, and evidence based decision making.'},
};

const spottingGuide = {
  dominator: {
    pace:'Fast',
    tone:'Direct and assertive',
    focus:'Winning the outcome',
    phrases:['"Bottom line"','"I need"','"Let\'s close this"'],
    behaviours:['Anchors high','Pushes deadlines','Interrupts often']
  },
  integrator: {
    pace:'Moderate',
    tone:'Curious and collaborative',
    focus:'Creative solutions',
    phrases:['"What if we"','"Both sides"','"How about"'],
    behaviours:['Asks about interests','Proposes packages','Seeks common ground']
  },
  yielder: {
    pace:'Slow',
    tone:'Gentle and agreeable',
    focus:'Harmony and rapport',
    phrases:['"That\'s fair"','"Whatever works"','"I understand"'],
    behaviours:['Concedes early','Avoids silence','Apologises often']
  },
  calculator: {
    pace:'Deliberate',
    tone:'Measured and precise',
    focus:'Evidence and analysis',
    phrases:['"The data shows"','"I need to check"','"Based on this"'],
    behaviours:['Requests time','Cites benchmarks','Brings documents']
  }
};

const matchupAdvice = {
  'dominator-integrator': {
    tells:[
      'They ask lots of questions before committing to anything',
      'They propose packages and creative trades rather than single item demands',
      'They use phrases like "what if" and "how about" frequently',
      'They focus on underlying interests rather than stated positions'
    ],
    advantages:[
      'Your decisiveness cuts through their lengthy exploration process',
      'You set the pace and they often follow your energy',
      'You are not afraid to push when the moment calls for it'
    ],
    risks:[
      'Dismissing their ideas too quickly and missing options that could benefit you',
      'Appearing unreasonable by refusing to explore alternatives',
      'Mistaking their patience for weakness when it is actually strategy'
    ],
    playbook:[
      'Let them explore options but set a clear deadline for decisions',
      'Treat their questions as information gathering, not stalling',
      'Propose your own packages rather than just rejecting theirs'
    ],
    fakeWarning:'If their proposals consistently favour them despite collaborative language, they are using integration as a cover for extraction. Watch whether the "creative solutions" actually improve your position or just repackage their demands in friendlier terms.'
  },
  'dominator-yielder': {
    tells:[
      'They speak softly and concede points early in the conversation',
      'They check whether you are comfortable and whether things feel fair',
      'They avoid silence and fill gaps with concessions or apologies',
      'They use phrases like "that\'s fair" and "whatever works for you"'
    ],
    advantages:[
      'You naturally control the pace and direction of the conversation',
      'They share information freely because they want to build trust',
      'You can anchor strongly and they are unlikely to push back hard'
    ],
    risks:[
      'Pushing so hard they agree to things they cannot actually deliver',
      'Destroying a relationship you might need for future deals',
      'Gaining a reputation as someone who exploits weaker counterparts'
    ],
    playbook:[
      'Moderate your intensity because they will likely give you what you want anyway',
      'Ask what they need rather than simply taking everything on the table',
      'A slightly softer approach here gets you a more durable and implementable deal'
    ],
    fakeWarning:'If a yielder suddenly stands firm on one specific point after giving everything else away, that point may be the real prize they were protecting all along. Their earlier concessions may have been strategic, designed to make you feel satisfied before the real negotiation begins.'
  },
  'dominator-calculator': {
    tells:[
      'They speak at a deliberate pace and pause before responding',
      'They reference data, benchmarks, and precedents frequently',
      'They request adjournments or additional time to review',
      'They bring documents and show minimal emotional expression'
    ],
    advantages:[
      'Your speed pressures their process and forces faster decisions',
      'Your confidence can shift momentum when their analysis is inconclusive',
      'You make decisions faster which lets you control the agenda'
    ],
    risks:[
      'Making claims they will fact check and disprove, damaging your credibility',
      'Losing respect if your numbers are wrong or your preparation is thin',
      'Underestimating how thoroughly they have prepared for this conversation'
    ],
    playbook:[
      'Bring solid data because they will challenge every claim that lacks evidence',
      'Respect their need for time or they will dig in harder out of principle',
      'Use their own analysis to support your position whenever possible'
    ],
    fakeWarning:'If they present data that perfectly supports only their position without acknowledging any counterpoints, their objectivity is a performance. Genuine analysis includes uncertainty. If theirs has none, it has been curated to persuade, not to inform.'
  },
  'integrator-dominator': {
    tells:[
      'They speak fast, interrupt, and push for quick decisions',
      'They use direct language like "I need" and "bottom line"',
      'They anchor high and make the first offer confidently',
      'They maintain strong eye contact and take up physical space'
    ],
    advantages:[
      'You see creative options they miss because they are focused only on winning',
      'You read the room better and notice dynamics they overlook entirely',
      'You can reframe their demands into opportunities that serve both sides'
    ],
    risks:[
      'Getting bulldozed while you are still exploring options',
      'Overthinking while they act decisively and claim the value on the table',
      'Confusing their confidence with being right about the substance'
    ],
    playbook:[
      'Acknowledge their position first before redirecting the conversation',
      'Ask "why" to slow their pace and uncover the interests behind their demands',
      'Propose packages that give them a visible win while protecting your priorities'
    ],
    fakeWarning:'If they suddenly turn warm and collaborative after being aggressive, check whether their proposals match their new tone. Real collaboration shows up in the deal structure, not just the conversation. Words are cheap. Numbers are honest.'
  },
  'integrator-yielder': {
    tells:[
      'They agree quickly and avoid pushing back on your proposals',
      'They use gentle language and check frequently if you are happy',
      'They concede early and often to maintain a positive atmosphere',
      'They apologise unnecessarily and fill silences with soft concessions'
    ],
    advantages:[
      'They trust you naturally and share information willingly',
      'They genuinely want to find common ground which aligns with your approach',
      'Your creative proposals will be received openly and without resistance'
    ],
    risks:[
      'Reaching agreement too easily without testing whether the deal is truly optimal',
      'Letting their accommodation mask unexplored value that both sides could share',
      'Mistaking their quick agreement for genuine satisfaction with the terms'
    ],
    playbook:[
      'Gently push past their first offer because they almost always have more room',
      'Ask what would make this deal great for them, not just acceptable',
      'Protect them from over conceding because it will damage the deal long term'
    ],
    fakeWarning:'If their constant agreeableness comes with subtle guilt trips or obligations attached, they may be using warmth as a tool to create debt you will be expected to repay. Genuine yielders give freely. Strategic ones keep a ledger.'
  },
  'integrator-calculator': {
    tells:[
      'They respond slowly and ask for time to review your proposals',
      'They reference benchmarks, market rates, and historical data',
      'They show minimal emotional reaction to your ideas',
      'They arrive with documents and want to work through details methodically'
    ],
    advantages:[
      'Your creativity complements their analytical rigour beautifully',
      'You bring warmth and rapport that they lack naturally',
      'You can build trust while they are still processing the numbers'
    ],
    risks:[
      'Frustrating them by moving too fast or proposing ideas without supporting evidence',
      'Dismissing their need for data as excessive caution or stalling',
      'Proposing solutions before they are ready to evaluate them properly'
    ],
    playbook:[
      'Lead with data before leading with ideas to earn their respect first',
      'Give them time to process your proposals rather than expecting immediate responses',
      'Frame creative options with supporting evidence and they will become your strongest allies'
    ],
    fakeWarning:'If they use complexity and data volume to overwhelm rather than clarify, they may be using analysis as a weapon to confuse you into accepting unfavourable terms. Genuine analysis simplifies decisions. Strategic analysis complicates them.'
  },
  'yielder-dominator': {
    tells:[
      'They speak fast, interrupt, and push the conversation toward quick decisions',
      'They use direct and sometimes blunt language without softening it',
      'They anchor high and make demands early and confidently',
      'They maintain intense eye contact and dominate the physical space'
    ],
    advantages:[
      'Your warmth disarms them and they may reveal more than they intended',
      'They underestimate you which means they prepare less carefully for you',
      'You read their emotional state better than they read yours'
    ],
    risks:[
      'Folding under pressure and agreeing to terms you will regret later',
      'Mistaking their confidence for authority they do not actually have',
      'Allowing their pace to override your own needs and boundaries'
    ],
    playbook:[
      'Write your non negotiables down before you walk in and do not move from them',
      'Let them push first, then respond with a calm but firm position',
      'Remember that their aggression is a style, not reality. The deal is rarely as urgent as they claim'
    ],
    fakeWarning:'If a dominator suddenly becomes your friend, complimenting you and asking personal questions, they are likely softening you up before a significant demand. When the shift comes, return to your written boundaries and do not let flattery move your position.'
  },
  'yielder-integrator': {
    tells:[
      'They ask lots of questions and explore multiple angles before committing',
      'They propose creative solutions and use "we" language naturally',
      'They focus on interests and underlying needs rather than stated positions',
      'They maintain a moderate pace and seem genuinely curious about your perspective'
    ],
    advantages:[
      'You build trust faster than they expect which opens doors to real information',
      'They genuinely value the relationship and will invest in maintaining it',
      'They will share information willingly because they believe in open exchange'
    ],
    risks:[
      'Over trusting their collaborative approach without verifying the deal serves your interests',
      'Agreeing to complex structures you do not fully understand',
      'Deferring to their expertise when you should be advocating for yourself'
    ],
    playbook:[
      'Ask them to explain every element of complex proposals until you fully understand',
      'Check whether their creative solutions actually give you what you need, not just what sounds fair',
      'Your warmth plus their strategy can produce excellent outcomes so stay engaged rather than deferring'
    ],
    fakeWarning:'If they consistently propose "win win" solutions where the wins are unequal and always in their favour, their collaboration is a negotiation technique, not a genuine value. Trust the numbers in the deal, not the language around it.'
  },
  'yielder-calculator': {
    tells:[
      'They respond at a deliberate pace and think carefully before speaking',
      'They reference data and ask detailed questions about specifics',
      'They show little emotional engagement and stay neutral throughout',
      'They request time to review and bring prepared documents to every meeting'
    ],
    advantages:[
      'Your warmth helps them relax and they open up more than usual',
      'You notice emotional cues they miss in themselves and others',
      'You create a comfortable atmosphere that draws out better information'
    ],
    risks:[
      'Feeling dismissed by their lack of emotional engagement with you',
      'Interpreting their analytical detachment as disinterest or disrespect',
      'Conceding on points where your own data would support a stronger position'
    ],
    playbook:[
      'Prepare your own data because they take you more seriously when you speak their language',
      'Do not fill silences with concessions. Their pauses are for processing, not pressuring you',
      'Ask them to walk you through their analysis so you can spot where to negotiate'
    ],
    fakeWarning:'If they present mountains of data that always supports their position, ask to see the assumptions behind the numbers. Selective data is a powerful form of manipulation disguised as objectivity. Fair analysis includes data that challenges their own position too.'
  },
  'calculator-dominator': {
    tells:[
      'They speak fast and push for quick decisions before you feel ready',
      'They use direct language, make demands, and apply time pressure',
      'They anchor high and lead with confident assertions about what they need',
      'They show impatience with detailed analysis and want to move forward immediately'
    ],
    advantages:[
      'Your preparation exposes gaps in their arguments they cannot bluff through',
      'Your data gives you solid ground to stand on when they apply pressure',
      'Your patience outlasts their intensity if you hold your nerve'
    ],
    risks:[
      'Retreating into analysis when you need to engage and respond directly',
      'Being too slow to respond to their quick tactical moves',
      'Winning the logical argument but losing the room emotionally'
    ],
    playbook:[
      'Present your strongest data point early to establish credibility and earn their respect',
      'Match their decisiveness with confident positions backed by solid evidence',
      'When they apply pressure, respond with facts not emotions. They respect substance over style'
    ],
    fakeWarning:'If their aggression spikes after you present strong evidence, they are likely bluffing because your data has weakened their position. Hold firm and let the silence work. A dominator who gets louder is usually a dominator who is losing ground.'
  },
  'calculator-integrator': {
    tells:[
      'They ask about your interests and underlying needs, not just your stated position',
      'They propose creative packages and multi item trades',
      'They use collaborative language and invite joint problem solving',
      'They maintain a moderate pace and seem genuinely curious about your perspective'
    ],
    advantages:[
      'Your analysis grounds their creativity in reality and prevents wishful thinking',
      'You spot risks in their proposals that others miss entirely',
      'Your rigour ensures any agreement is implementable and durable over time'
    ],
    risks:[
      'Dismissing creative options because they lack immediate data support',
      'Being too rigid about process while they build relationships around you',
      'Appearing cold and disengaged while they connect with everyone else in the room'
    ],
    playbook:[
      'Evaluate their proposals on merit rather than dismissing what you cannot immediately quantify',
      'Combine your analytical strength with their creative ideas for solutions that are both innovative and robust',
      'Let them handle the relationship building while you ensure the deal structure is sound'
    ],
    fakeWarning:'If they frame every concession they want as a "creative solution" or "mutual benefit," run the numbers independently. Genuine integration improves both positions. Strategic integration improves only theirs while sounding like it helps everyone.'
  },
  'calculator-yielder': {
    tells:[
      'They speak softly and agree quickly without challenging your points',
      'They defer to your expertise and rarely question your data or conclusions',
      'They avoid confrontation and fill silences with soft concessions',
      'They apologise unnecessarily and check frequently whether things feel fair'
    ],
    advantages:[
      'They respect your preparation and take your analysis seriously from the start',
      'They share information freely because they want to build a trusting relationship',
      'They will defer to well presented evidence based arguments without resistance'
    ],
    risks:[
      'Steamrolling them with data and getting a deal they cannot actually implement',
      'Mistaking their agreement for genuine understanding and commitment to the terms',
      'Overlooking their concerns because they are too polite to raise them directly'
    ],
    playbook:[
      'Slow your analysis down and check they understand and genuinely agree, not just comply',
      'Ask what concerns they have rather than waiting for objections they will never volunteer',
      'A deal they fully understand and support will be implemented far better than one they simply accepted'
    ],
    fakeWarning:'If they agree with everything but the deal stalls during implementation, they may have agreed to end the discomfort of negotiating rather than because they genuinely supported the terms. Silence from a yielder does not mean satisfaction. It often means suppression.'
  }
};

function calcResults(answers){
  const sc={dominator:0,integrator:0,yielder:0,calculator:0};
  let sh=0;
  answers.forEach((oi,qi)=>{
    const q=questions[qi];
    if(q.type==='style') sc[q.options[oi].map]++;
    else if(q.options[oi].shadow) sh++;
  });
  const sorted=Object.entries(sc).sort((a,b)=>b[1]-a[1]);
  const topScore=sorted[0][1];
  const tied=sorted.filter(([_,v])=>v===topScore).map(([k])=>k);
  if(tied.length>1) return {scores:sc,shadow:sh,tied};
  const p=sorted[0][0], s=sorted[1][0];
  return {scores:sc,shadow:sh,primary:p,secondary:s,archetype:archetypes[p+'-'+s]};
}

function genSVGPetal(sc) {
  const cx = 200, cy = 200, maxR = 120, ringOuterR = 158, ringInnerR = 134, total = 16;
  const styles = [
    {key:'dominator', label:'DOMINATOR', color:'#DC2626', light:'#FEE2E2', angle:-Math.PI/2},
    {key:'integrator', label:'INTEGRATOR', color:'#9333EA', light:'#F3E8FF', angle:0},
    {key:'yielder', label:'YIELDER', color:'#16A34A', light:'#DCFCE7', angle:Math.PI/2},
    {key:'calculator', label:'CALCULATOR', color:'#2563EB', light:'#DBEAFE', angle:Math.PI},
  ];

  const arcPath = (sa, ea, iR, oR) => {
    const sx = cx + oR * Math.cos(sa), sy = cy + oR * Math.sin(sa);
    const ex = cx + oR * Math.cos(ea), ey = cy + oR * Math.sin(ea);
    const ix = cx + iR * Math.cos(ea), iy = cy + iR * Math.sin(ea);
    const jx = cx + iR * Math.cos(sa), jy = cy + iR * Math.sin(sa);
    return `M${sx},${sy} A${oR},${oR} 0 0 1 ${ex},${ey} L${ix},${iy} A${iR},${iR} 0 0 0 ${jx},${jy}Z`;
  };
  const wedgeD = (sa, ea, r) => {
    const sx = cx + r * Math.cos(sa), sy = cy + r * Math.sin(sa);
    const ex = cx + r * Math.cos(ea), ey = cy + r * Math.sin(ea);
    return `M${cx},${cy} L${sx},${sy} A${r},${r} 0 0 1 ${ex},${ey}Z`;
  };

  let defs = '';
  styles.forEach(s => {
    const r = (ringOuterR + ringInnerR) / 2, spread = Math.PI / 4.5;
    if (s.angle === Math.PI) {
      const sa = s.angle + spread, ea = s.angle - spread;
      defs += `<path id="tp-${s.key}" d="M${cx + r * Math.cos(sa)},${cy + r * Math.sin(sa)} A${r},${r} 0 0 0 ${cx + r * Math.cos(ea)},${cy + r * Math.sin(ea)}"/>`;
    } else {
      const sa = s.angle - spread, ea = s.angle + spread;
      defs += `<path id="tp-${s.key}" d="M${cx + r * Math.cos(sa)},${cy + r * Math.sin(sa)} A${r},${r} 0 0 1 ${cx + r * Math.cos(ea)},${cy + r * Math.sin(ea)}"/>`;
    }
  });

  const bg = `<circle cx="${cx}" cy="${cy}" r="${ringOuterR}" fill="#FAFAFA"/>`;

  const bgWedges = styles.map(s =>
    `<path d="${wedgeD(s.angle - Math.PI/4, s.angle + Math.PI/4, ringInnerR)}" fill="${s.light}" opacity="0.35"/>`
  ).join('');

  const guides = [0.25, 0.5, 0.75, 1].map(f =>
    `<circle cx="${cx}" cy="${cy}" r="${maxR * f}" fill="none" stroke="#E2E8F0" stroke-width="0.75"/>`
  ).join('');

  const scoreWedges = styles.map(s => {
    const r = Math.max((sc[s.key] / total) * maxR, 8);
    return `<path d="${wedgeD(s.angle - Math.PI/4, s.angle + Math.PI/4, r)}" fill="${s.color}" opacity="1"/>`;
  }).join('');

  const dividers = styles.map(s => {
    const a = s.angle - Math.PI / 4;
    return `<line x1="${cx}" y1="${cy}" x2="${cx + ringInnerR * Math.cos(a)}" y2="${cy + ringInnerR * Math.sin(a)}" stroke="white" stroke-width="3" opacity="0.9"/>`;
  }).join('');

  const center = `<circle cx="${cx}" cy="${cy}" r="7" fill="white" stroke="#E5E7EB" stroke-width="1.5"/><circle cx="${cx}" cy="${cy}" r="3" fill="#94A3B8" opacity="0.4"/>`;

  const rings = styles.map(s =>
    `<path d="${arcPath(s.angle - Math.PI/4 + 0.02, s.angle + Math.PI/4 - 0.02, ringInnerR, ringOuterR)}" fill="${s.color}" opacity="1" stroke="white" stroke-width="2"/>`
  ).join('');

  const labels = styles.map(s =>
    `<text><textPath href="#tp-${s.key}" startOffset="50%" text-anchor="middle" fill="white" font-size="11" font-weight="bold" font-family="system-ui,sans-serif" letter-spacing="2">${s.label}</textPath></text>`
  ).join('');

  const scores = styles.map(s => {
    const lR = ringOuterR + 18;
    const pct = Math.round((sc[s.key] / total) * 100);
    return `<text x="${cx + lR * Math.cos(s.angle)}" y="${cy + lR * Math.sin(s.angle) + 4}" text-anchor="middle" fill="${s.color}" font-size="12" font-weight="bold" font-family="system-ui,sans-serif">${pct}%</text>`;
  }).join('');

  return `<svg viewBox="0 0 400 400" width="400" height="400" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>${bg}${bgWedges}${guides}${scoreWedges}${dividers}${center}${rings}${labels}${scores}</svg>`;
}

const sanitize = (str) => str.replace(/[<>&"']/g, c => ({
  '<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&#39;'
}[c]));
function genHTML(r,name){
  const a=r.archetype,sc=r.scores,sl=shadowLevels[r.shadow],p=r.primary,s=r.secondary;
  const total=16;
  const pct=k=>Math.round((sc[k]/total)*100);
  const nl=t=>t.replace(/\n\n/g,'</p><p style="margin-top:14px;">');
  const fmtSec=(text,color)=>{const dot=text.indexOf('.');if(dot===-1)return '<p style="font-size:13px;color:#4B5563;line-height:1.8;">'+text+'</p>';const quote=text.substring(0,dot+1);const rest=text.substring(dot+1).trim();const body=rest.split('\n\n').filter(p=>p.trim()).map(p=>'<p style="font-size:13px;color:#4B5563;line-height:1.8;margin-top:14px;">'+p+'</p>').join('');return '<div style="border-left:3px solid '+color+';padding-left:16px;margin:16px 0;"><p style="font-style:italic;font-weight:600;font-size:14px;color:#1F2937;line-height:1.6;">'+quote+'</p></div>'+body;};
const shBg=r.shadow>=4?'#1C1917':r.shadow>=3?'#292524':r.shadow>=2?'#44403C':'#F0FDF4';
const shBd=r.shadow>=4?'#DC2626':r.shadow>=3?'#F59E0B':r.shadow>=2?'#78716C':'#4ADE80';
const shTx=r.shadow>=4?'#EF4444':r.shadow>=3?'#FBBF24':r.shadow>=2?'#D6D3D1':'#15803D';
const safeName=name?sanitize(name):'';
const greeting=safeName?`<p style="font-size:18px;color:#6B7280;margin-bottom:8px;">Prepared for: <strong style="color:#1F2937;">${safeName}</strong></p>`:'';  const svg=genSVGPetal(sc);
  const spotStyles=['dominator','integrator','yielder','calculator'];
const spotGrid=spotStyles.map(style=>{
  const sg=spottingGuide[style];
  const col=styleMeta[style].color;
  const lab=styleMeta[style].label;
  return `<div style="border:2px solid ${col}30;border-radius:8px;padding:16px;background:${col}08;break-inside:avoid;">
<div style="font-weight:bold;color:${col};font-size:15px;margin-bottom:10px;">${lab}</div>
<div style="font-size:12px;color:#374151;line-height:1.8;">
<p><strong style="color:#6B7280;">Pace:</strong> ${sg.pace}</p>
<p><strong style="color:#6B7280;">Tone:</strong> ${sg.tone}</p>
<p><strong style="color:#6B7280;">Focus:</strong> ${sg.focus}</p>
<p style="margin-top:8px;"><strong style="color:#6B7280;">You will hear:</strong> ${sg.phrases.join(' · ')}</p>
<p style="margin-top:8px;"><strong style="color:#6B7280;">They will:</strong></p>
${sg.behaviours.map(b=>`<p style="margin-left:8px;">• ${b}</p>`).join('')}
</div></div>`;
}).join('');

const opponents=spotStyles.filter(st=>st!==p);
const matchupCards=opponents.map(opp=>{
  const key=p+'-'+opp;
  const m=matchupAdvice[key];
  const oppCol=styleMeta[opp].color;
  const oppLab=styleMeta[opp].label;
  const myCol=styleMeta[p].color;
  const myLab=styleMeta[p].label;
  return `<div style="border:1px solid #E5E7EB;border-radius:8px;margin-bottom:16px;overflow:hidden;break-inside:avoid;">
<div style="padding:12px 20px;background:${myCol}10;">
<span style="font-weight:bold;color:${myCol};">You (${myLab})</span>
<span style="color:#9CA3AF;margin:0 8px;">vs</span>
<span style="font-weight:bold;color:${oppCol};">${oppLab}</span>
</div>
<div style="padding:20px;">
<h4 style="font-size:11px;font-weight:bold;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Their Tells</h4>
${m.tells.map(t=>`<p style="font-size:13px;color:#374151;margin-bottom:4px;">• ${t}</p>`).join('')}
<div style="display:flex;gap:20px;margin-top:16px;">
<div style="flex:1;">
<h4 style="font-size:11px;font-weight:bold;color:#16A34A;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Your Advantages</h4>
${m.advantages.map(av=>`<p style="font-size:13px;color:#374151;margin-bottom:4px;">✓ ${av}</p>`).join('')}
</div>
<div style="flex:1;">
<h4 style="font-size:11px;font-weight:bold;color:#DC2626;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Your Risks</h4>
${m.risks.map(ri=>`<p style="font-size:13px;color:#374151;margin-bottom:4px;">✗ ${ri}</p>`).join('')}
</div>
</div>
<h4 style="font-size:11px;font-weight:bold;color:#1E40AF;text-transform:uppercase;letter-spacing:1px;margin-top:16px;margin-bottom:8px;">Your Playbook</h4>
${m.playbook.map((step,i)=>`<p style="font-size:13px;color:#374151;margin-bottom:4px;"><strong style="color:#1E40AF;">${i+1}.</strong> ${step}</p>`).join('')}
<div style="margin-top:16px;padding:14px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;">
<h4 style="font-size:11px;font-weight:bold;color:#B45309;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">⚠️ Watch For The Fake</h4>
<p style="font-size:13px;color:#92400E;">${m.fakeWarning}</p>
</div>
</div></div>`;
}).join('');

const readingRoom=`<div class="sec" style="margin-top:32px;">
<h2 style="color:#1E40AF;font-size:20px;border-bottom:2px solid #1E40AF;padding-bottom:6px;">Reading The Room</h2>
<p style="color:#6B7280;font-size:14px;margin-top:8px;margin-bottom:20px;">How to spot each negotiation style and what to do when you are sitting across from them.</p>
<h3 style="font-size:12px;font-weight:bold;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Spot Their Style</h3>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
${spotGrid}
</div>
<h3 style="font-size:12px;font-weight:bold;color:#9CA3AF;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Your Tactical Playbook</h3>
${matchupCards}
<div style="margin-top:20px;padding:20px;background:#111827;color:white;border-radius:8px;">
<h4 style="font-weight:bold;font-size:14px;margin-bottom:8px;">The Most Important Rule</h4>
<p style="font-size:13px;color:#D1D5DB;">The most dangerous negotiator is not the one who is aggressive. It is the one who is pretending to be something they are not. If someone's words say collaboration but their proposals say competition, trust the proposals. If their warmth appeared suddenly and conveniently, question what it is designed to achieve. Behaviour reveals intention far more reliably than language ever will.</p>
</div>
</div>`;
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Negotiation Profile Report</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,'Times New Roman',serif;max-width:760px;margin:0 auto;padding:48px 28px;color:#1F2937;line-height:1.75;background:#fff}
.radar{text-align:center;margin:24px 0 32px}
.scores{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin:24px 0 32px}
.si{text-align:center;padding:14px 24px;border-radius:8px;border:2px solid;min-width:120px}
.si .n{font-size:28px;font-weight:bold}.si .l{font-size:13px;margin-top:2px}.si .p{font-size:12px;color:#6B7280}
.sec{margin-bottom:24px}.sec h2{font-size:17px;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #E5E7EB}
.sec p{color:#374151}
.sh{margin-top:32px;padding:20px;border-radius:8px;border:2px solid}
.sh h2{border:none;margin-bottom:4px}.sh .sub{font-weight:600;margin-bottom:8px}
.ft{margin-top:48px;padding-top:20px;border-top:2px solid #E5E7EB;text-align:center;font-size:13px;color:#9CA3AF}
@page{size:portrait;margin:12mm 14mm}@media print{body{padding:0;font-size:10.5pt;zoom:0.98;-webkit-print-color-adjust:exact;print-color-adjust:exact}body>div{break-inside:avoid!important;page-break-inside:avoid!important}body>table{break-inside:avoid!important;page-break-inside:avoid!important}h3{break-after:avoid!important;page-break-after:avoid!important}div[style*="border-radius:8px"]{break-inside:avoid!important;page-break-inside:avoid!important}}</style></head><body style="font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
${greeting}
<p style="font-size:11px;color:rgba(29,78,216,0.6);font-weight:600;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px;text-align:center;">Your Negotiation Archetype</p>
<h1 style="font-size:30px;font-weight:bold;color:#1E40AF;margin-bottom:8px;text-align:center;">${a.name}</h1>
<p style="font-size:16px;color:#6B7280;margin-bottom:16px;text-align:center;">${a.tagline}</p>
<div style="display:flex;align-items:center;justify-content:center;gap:12px;">
<span style="padding:4px 12px;border-radius:999px;font-size:12px;font-weight:bold;color:white;background-color:${styleMeta[p].color};">Primary: ${styleMeta[p].label}</span>
<span style="padding:4px 12px;border-radius:999px;font-size:12px;font-weight:bold;color:white;background-color:${styleMeta[s].color};">Secondary: ${styleMeta[s].label}</span>
</div>
</div>
<div class="radar">${svg}</div>
<div style="padding:20px 0;">
${['dominator','integrator','yielder','calculator'].map(k=>{
  const colors={dominator:'#DC2626',integrator:'#9333EA',yielder:'#16A34A',calculator:'#2563EB'};
  const labels={dominator:'Dominator',integrator:'Integrator',yielder:'Yielder',calculator:'Calculator'};
  return `<div style="margin-bottom:12px;">
    <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
      <span style="font-weight:600;color:${colors[k]}">${labels[k]}</span>
      <span style="font-weight:700;color:${colors[k]}">${pct(k)}%</span>
    </div>
    <div style="background:#E5E7EB;border-radius:999px;height:10px;overflow:hidden;">
      <div style="width:${pct(k)}%;height:100%;background:${colors[k]};border-radius:999px;"></div>
    </div>
  </div>`;
}).join('')}
</div>

<div style="background:white;border:1px solid #E5E7EB;border-radius:12px;padding:24px;margin-bottom:24px;">
<h3 style="font-size:11px;font-weight:600;color:rgba(30,58,138,0.6);text-transform:uppercase;letter-spacing:3px;text-align:center;margin-bottom:4px;">${a.emoji} Your Archetype</h3>
<p style="font-size:22px;font-weight:bold;color:#1E40AF;text-align:center;margin-bottom:16px;">${a.name}</p>
<p style="font-size:13px;color:#4B5563;line-height:1.8;">${nl(a.narrative)}</p>
</div>
<div style="background:white;border:1px solid #E5E7EB;border-radius:12px;padding:24px;margin-bottom:24px;">
<h3 style="font-size:11px;font-weight:600;color:rgba(30,58,138,0.6);text-transform:uppercase;letter-spacing:3px;text-align:center;margin-bottom:4px;">Your Primary Style</h3>
<p style="font-size:22px;font-weight:bold;color:${styleMeta[p].color};text-align:center;margin-bottom:16px;">${styleMeta[p].label}</p>
${fmtSec(stylePrimary[p], styleMeta[p].color)}
</div>
<div style="background:white;border:1px solid #E5E7EB;border-radius:12px;padding:24px;margin-bottom:24px;">
<h3 style="font-size:11px;font-weight:600;color:rgba(30,58,138,0.6);text-transform:uppercase;letter-spacing:3px;text-align:center;margin-bottom:4px;">Your Secondary Influence</h3>
<p style="font-size:22px;font-weight:bold;color:${styleMeta[s].color};text-align:center;margin-bottom:16px;">${styleMeta[s].label}</p>
${fmtSec(styleSecondary[s], styleMeta[s].color)}
</div>
<div style="background:#EFF6FF;border:1px solid #BFDBFE;border-left:4px solid #1E40AF;border-radius:12px;padding:24px;margin-bottom:24px;">
<h3 style="font-size:16px;font-weight:700;color:#1E40AF;margin-bottom:16px;"> How Others Experience You</h3>${fmtSec(a.howOthersSeeYou, '#1E40AF')}
</div>
<table style="width:100%;border-collapse:separate;border-spacing:16px 0;margin-bottom:24px;"><tr>
<td style="width:50%;vertical-align:top;background:#F0FDF4;border:1px solid #BBF7D0;border-left:4px solid #16A34A;border-radius:12px;padding:20px;">
<h3 style="font-size:14px;font-weight:700;color:#16A34A;margin-bottom:16px;">💪 Your Strengths</h3>
${a.strengths.split('. ').filter(s=>s.trim().length>10).map(s=>
'<div style="display:flex;gap:8px;margin-bottom:10px;"><span style="color:#16A34A;font-weight:700;flex-shrink:0;">✓</span><p style="font-size:12px;color:#4B5563;line-height:1.6;margin:0;">'+s.trim().replace(/\.$/,'')+'.</p></div>'
).join('')}
</td>
<td style="width:50%;vertical-align:top;background:#FEF2F2;border:1px solid #FECACA;border-left:4px solid #DC2626;border-radius:12px;padding:20px;">
<h3 style="font-size:14px;font-weight:700;color:#DC2626;margin-bottom:16px;">⚡ Your Weaknesses</h3>
${a.weaknesses.split('. ').filter(s=>s.trim().length>10).map(s=>
'<div style="display:flex;gap:8px;margin-bottom:10px;"><span style="color:#DC2626;font-weight:700;flex-shrink:0;">✗</span><p style="font-size:12px;color:#4B5563;line-height:1.6;margin:0;">'+s.trim().replace(/\.$/,'')+'.</p></div>'
).join('')}
</td>
</tr></table>
<div style="background:#FAF5FF;border:1px solid #E9D5FF;border-left:4px solid #9333EA;border-radius:12px;padding:24px;margin-bottom:24px;">
<h3 style="font-size:16px;font-weight:700;color:#9333EA;margin-bottom:16px;"> Your Blind Spots</h3>
${fmtSec(a.blindSpots, '#9333EA')}
</div>
<div style="background:#FFF7ED;border:1px solid #FED7AA;border-left:4px solid #D97706;border-radius:12px;padding:24px;margin-bottom:24px;">
<h3 style="font-size:16px;font-weight:700;color:#D97706;margin-bottom:16px;"> Under Pressure</h3>${fmtSec(a.underPressure, '#D97706')}
</div>
<div style="background:#FEF2F2;border:1px solid #FECACA;border-left:4px solid #DC2626;border-radius:12px;padding:24px;margin-bottom:24px;">
<h3 style="font-size:16px;font-weight:700;color:#DC2626;margin-bottom:16px;">⚠️ Watch Out</h3>
${fmtSec(a.watchOut, '#DC2626')}
</div>
<div style="background:#F0FDF4;border:1px solid #BBF7D0;border-left:4px solid #16A34A;border-radius:12px;padding:24px;margin-bottom:24px;">
<h3 style="font-size:16px;font-weight:700;color:#16A34A;margin-bottom:16px;">🌱 Your Growth Edge</h3>
${fmtSec(a.growthEdge, '#16A34A')}
${a.growthSteps.map((step,i)=>`
<div style="display:flex;align-items:flex-start;margin:12px 0;">
<div style="min-width:28px;height:28px;background:#16A34A;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;margin-right:12px;">${i+1}</div>
<p style="font-size:13px;color:#4B5563;line-height:1.6;margin:0;padding-top:4px;">${step}</p>
</div>
`).join('')}
</div>

<div style="background:white;border:1px solid #E5E7EB;border-radius:12px;padding:24px;margin-bottom:24px;">
<h3 style="font-size:11px;font-weight:600;color:rgba(30,58,138,0.6);text-transform:uppercase;letter-spacing:3px;text-align:center;margin-bottom:4px;">Style Intensity Profile</h3>
<p style="font-size:12px;color:#6B7280;text-align:center;margin-bottom:24px;">How strongly each negotiation style influences your behaviour at the table based upon your responses.</p>
${['dominator','integrator','yielder','calculator'].map(style=>{
  const score=sc[style];
  const level=score<=1?'negligible':score<=3?'low':score<=6?'moderate':score<=9?'high':'dominant';
  const levelText={negligible:'Negligible',low:'Low',moderate:'Moderate',high:'High',dominant:'Dominant'}[level];
  const levelBg={negligible:'#F3F4F6',low:'#E5E7EB',moderate:'#DBEAFE',high:'#FEF3C7',dominant:'#FEE2E2'}[level];
  const levelCol={negligible:'#94A3B8',low:'#64748B',moderate:'#3B82F6',high:'#F59E0B',dominant:'#EF4444'}[level];
  const col=styleMeta[style].color;
  const pctVal=pct(style);
  const desc=styleLevels[style][level];
  return `<div style="border:1px solid #F3F4F6;border-radius:8px;padding:16px;margin-bottom:16px;">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
<div style="display:flex;align-items:center;gap:8px;">
<div style="width:12px;height:12px;border-radius:50%;background-color:${col};"></div>
<span style="font-weight:bold;font-size:14px;color:${col};">${styleMeta[style].label}</span>
</div>
<div style="display:flex;align-items:center;gap:12px;">
<span style="padding:2px 8px;border-radius:4px;font-size:12px;font-weight:bold;background:${levelBg};color:${levelCol};">${levelText}</span>
<span style="font-size:14px;font-weight:bold;color:#6B7280;">${pctVal}%</span>
</div>
</div>
<div style="height:10px;background:#F3F4F6;border-radius:99px;overflow:hidden;margin-bottom:12px;">
<div style="height:100%;width:${pctVal}%;background:${col};border-radius:99px;"></div>
</div>
<p style="font-size:13px;font-weight:600;color:#1F2937;margin-bottom:6px;">${styleMeta[style].brief}</p>
<p style="font-size:13px;color:#4B5563;line-height:1.7;">${desc}</p>
</div>`;
}).join('')}
</div>

${readingRoom}

<div class="sh" style="background:${shBg};border:2px solid ${shBd};border-left:6px solid ${shTx};border-radius:12px;padding:28px;margin-bottom:24px;"><h2 style="color:${shTx};font-size:22px;font-weight:800;margin-bottom:8px;">⚡ Shadow Assessment: ${sl.title}</h2><div class="sub" style="color:${shTx};font-weight:600;font-size:15px;margin-bottom:12px;">${sl.sub}</div><p style="color:${r.shadow>=2?'#E7E5E4':'#1C1917'};font-size:14px;line-height:1.7;">${nl(sl.msg)}</p></div><p style="margin-top:8px;">To book a custom negotiation programme: admin@bucademy.com</p></div></body></html>`;
}

const PetalChart = ({ scores }) => {
  const cx = 200, cy = 200;
  const maxR = 125;
  const ringOuterR = 178;
  const ringInnerR = 128;
  const total = 16;

  const styles = [
    { key:'dominator', label:'DOMINATOR', color:'#DC2626', light:'#FEE2E2', angle:-Math.PI/2 },
    { key:'integrator', label:'INTEGRATOR', color:'#9333EA', light:'#F3E8FF', angle:0 },
    { key:'yielder', label:'YIELDER', color:'#16A34A', light:'#DCFCE7', angle:Math.PI/2 },
    { key:'calculator', label:'CALCULATOR', color:'#2563EB', light:'#DBEAFE', angle:Math.PI },
  ];

  const arcPath = (startAngle, endAngle, iR, oR) => {
    const sx = cx + oR * Math.cos(startAngle), sy = cy + oR * Math.sin(startAngle);
    const ex = cx + oR * Math.cos(endAngle), ey = cy + oR * Math.sin(endAngle);
    const ix = cx + iR * Math.cos(endAngle), iy = cy + iR * Math.sin(endAngle);
    const jx = cx + iR * Math.cos(startAngle), jy = cy + iR * Math.sin(startAngle);
    return `M${sx},${sy} A${oR},${oR} 0 0 1 ${ex},${ey} L${ix},${iy} A${iR},${iR} 0 0 0 ${jx},${jy}Z`;
  };

  const wedgePath = (startAngle, endAngle, r) => {
    const sx = cx + r * Math.cos(startAngle), sy = cy + r * Math.sin(startAngle);
    const ex = cx + r * Math.cos(endAngle), ey = cy + r * Math.sin(endAngle);
    return `M${cx},${cy} L${sx},${sy} A${r},${r} 0 0 1 ${ex},${ey} Z`;
  };

  return (
   <svg viewBox="-30 -30 460 460" className="w-full h-full">
      {/* Background */}
      <circle cx={cx} cy={cy} r={ringOuterR + 2} fill="#F8FAFC"/>

      {/* Light quadrant tints */}
      {styles.map(s => (
        <path key={`bg-${s.key}`}
          d={wedgePath(s.angle - Math.PI/4, s.angle + Math.PI/4, ringInnerR)}
          fill={s.light} opacity="0.35"/>
      ))}

      {/* Guide rings */}
      {[0.25, 0.5, 0.75, 1].map(f => (
        <circle key={f} cx={cx} cy={cy} r={maxR * f}
          fill="none" stroke="#E2E8F0" strokeWidth="0.75"/>
      ))}

      {/* Solid coloured score wedges */}
      {styles.map(s => {
        const r = Math.max((scores[s.key] / total) * maxR, 8);
        return (
          <path key={`score-${s.key}`}
            d={wedgePath(s.angle - Math.PI/4, s.angle + Math.PI/4, r)}
            fill={s.color} opacity="1"/>
        );
      })}

      {/* White dividers between quadrants */}
      {styles.map(s => {
        const a = s.angle - Math.PI / 4;
        return (
          <line key={`div-${s.key}`} x1={cx} y1={cy}
            x2={cx + ringInnerR * Math.cos(a)} y2={cy + ringInnerR * Math.sin(a)}
            stroke="white" strokeWidth="3" opacity="0.9"/>
        );
      })}

      {/* Centre dot */}
      <circle cx={cx} cy={cy} r="7" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
      <circle cx={cx} cy={cy} r="3" fill="#94A3B8" opacity="0.4"/>

      {/* Outer ring arcs */}
      {styles.map(s => (
        <path key={`ring-${s.key}`}
          d={arcPath(s.angle - Math.PI/4, s.angle + Math.PI/4, ringInnerR, ringOuterR)}
          fill={s.color} stroke={s.color} strokeWidth="0.5"/>
      ))}

      {/* White separators on ring */}
      {styles.map(s => {
        const a = s.angle - Math.PI / 4;
        return (
          <line key={`rsep-${s.key}`}
            x1={cx + ringInnerR * Math.cos(a)} y1={cy + ringInnerR * Math.sin(a)}
            x2={cx + ringOuterR * Math.cos(a)} y2={cy + ringOuterR * Math.sin(a)}
            stroke="white" strokeWidth="3"/>
        );
      })}

      {/* Curved labels on ring */}
      {styles.map(s => {
        const r = (ringOuterR + ringInnerR) / 2;
        const spread = Math.PI / 5;
        let pathD;
        if (s.angle === Math.PI || s.angle === Math.PI/2) {
          const sa = s.angle + spread, ea = s.angle - spread;
          pathD = `M${cx + r * Math.cos(sa)},${cy + r * Math.sin(sa)} A${r},${r} 0 0 0 ${cx + r * Math.cos(ea)},${cy + r * Math.sin(ea)}`;
        } else {
          const sa = s.angle - spread, ea = s.angle + spread;
          pathD = `M${cx + r * Math.cos(sa)},${cy + r * Math.sin(sa)} A${r},${r} 0 0 1 ${cx + r * Math.cos(ea)},${cy + r * Math.sin(ea)}`;
        }
        return (
          <g key={`lbl-${s.key}`}>
            <path id={`tp2-${s.key}`} d={pathD} fill="none"/>
            <text>
              <textPath href={`#tp2-${s.key}`} startOffset="50%" textAnchor="middle"
               fill="white" fontSize="16" fontWeight="bold" fontFamily="system-ui,sans-serif"
                letterSpacing="4">{s.label}</textPath>
            </text>
          </g>
        );
      })}

      {/* Score percentages */}
      {styles.map(s => {
        const lR = ringOuterR + 20;
        const lx = cx + lR * Math.cos(s.angle);
        const ly = cy + lR * Math.sin(s.angle);
        const pct = Math.round((scores[s.key] / total) * 100);
        return (
          <text key={`score-${s.key}`} x={lx} y={ly + 4} textAnchor="middle"
            fill={s.color} fontSize="14" fontWeight="bold" fontFamily="system-ui,sans-serif">
            {pct}%
          </text>
        );
      })}
    </svg>
  );
};

export default function NegotiationAssessment(){
  const[phase,setPhase]=useState('intro');
  const[qi,setQi]=useState(0);
  const[answers,setAnswers]=useState([]);
  const[sel,setSel]=useState(null);
  const[results,setResults]=useState(null);
  const[userName,setUserName]=useState('');
const[tieData,setTieData]=useState(null); 
const[saved,setSaved]=useState(false);
const [userEmail, setUserEmail] = useState('');
const [emailError, setEmailError] = useState('');
const [emailStatus, setEmailStatus] = useState('idle');

useEffect(() => {
  if (phase === 'results' && results && !saved) {
    const saveResult = async () => {
      const { error } = await supabase
        .from('results')
        .insert([{
          archetype: results.archetype.name,
          style: results.primary,
          name: userName || 'Anonymous'
        }])
      if (error) console.error('Save failed:', error)
      else setSaved(true)
    }
    saveResult()
  }
}, [phase, results, userName, saved])

useEffect(() => {
  if (phase === 'results' && results && userEmail && emailStatus === 'idle') {
    sendReportEmail();
  }
}, [phase, results]); // eslint-disable-line react-hooks/exhaustive-deps



const next=()=>{if(sel===null)return;const na=[...answers,sel];setAnswers(na);setSel(null);if(qi<questions.length-1)setQi(qi+1);else{const r=calcResults(na);if(r.tied){setTieData(r);setPhase('tiebreak');}else{setResults(r);setPhase('results');}}};  const back=()=>{if(qi>0){const na=[...answers];const prev=na.pop();setAnswers(na);setSel(prev);setQi(qi-1);}};
// eslint-disable-next-line no-unused-vars
const restart=()=>{setPhase('intro');setQi(0);setAnswers([]);setSel(null);setResults(null);setUserName('');setSaved(false);};
const download=()=>{if(!results)return;const html=genHTML(results,userName);const w=window.open('','_blank');if(!w)return;w.document.write(html);w.document.close();setTimeout(()=>{w.print();},500);};
const sendReportEmail = async () => {
  if (!results || !userEmail) return;
  setEmailStatus('sending');
  try {
    const response = await fetch('/api/send-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userEmail.trim(),
        userName: userName || '',
        results: results,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send');
    setEmailStatus('sent');
  } catch (err) {
    console.error('Failed to send report email:', err);
    setEmailStatus('failed');
  }
};
if(phase==='intro') return(
  <div className="min-h-screen flex flex-col min-w-0 overflow-x-hidden">

    {/* ═══ HERO ═══ */}
   <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center px-6 overflow-hidden pb-12">
  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

  <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:1}} className="relative z-10 text-center max-w-2xl">
    <p className="text-blue-400/90 text-sm font-semibold tracking-widest uppercase mb-8">The Buckingham Academy</p>

    <h1 className="text-4xl sm:text-5xl font-bold mb-3 leading-tight tracking-tight text-white">
      You're Leaving Value<br/>on the Table.
    </h1>

    <p className="text-3xl sm:text-4xl font-bold mb-8 leading-tight tracking-tight bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
      Let's Fix That.
    </p>

    <p className="text-blue-200/70 text-lg sm:text-xl mb-12 max-w-lg mx-auto leading-relaxed">
      Take the 7 minute Negotiation Style Assessment and uncover the hidden patterns shaping every deal you walk into.
    </p>

    <div className="flex items-center justify-center gap-6 sm:gap-8 text-xs text-blue-100/60 mb-10">
      {[['21','Questions'],['4','Styles'],['12','Archetypes'],['7','Minutes']].map(([num,label],i)=>(
        <div key={i} className="flex flex-col items-center gap-1">
          <span className="text-2xl font-bold text-white">{num}</span>
          <span className="uppercase tracking-widest text-xs opacity-60">{label}</span>
        </div>
      ))}
    </div>

    <motion.div animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:2}} className="text-blue-300/40 text-sm">
      ↓ Scroll to learn more
    </motion.div>
  </motion.div>
</div>

   {/* ═══ PROBLEM ═══ */}
   <div className="bg-slate-950 px-6 py-24">
  <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-100px'}} transition={{duration:0.8}} className="max-w-2xl mx-auto text-center">
    <p className="text-red-400/90 text-sm font-semibold tracking-widest uppercase mb-6">The Problem</p>
    <h2 className="text-3xl sm:text-4xl font-bold mb-8 leading-tight text-white">Most Professionals Negotiate<br/>on Autopilot</h2>
    <div className="space-y-5 text-blue-100/70 text-lg leading-relaxed max-w-xl mx-auto">
      <p>You've developed habits over years, ways you handle pushback, make concessions, build (or avoid) tension. Most of it is <span className="text-white font-medium">invisible to you</span>.</p>
      <p>Some of those instincts give you a genuine edge. Others are <span className="text-white font-medium">quietly costing you</span> in margin, in trust, in outcomes you never realise you missed.</p>
      <p className="text-white/90 font-medium text-xl pt-4">You can't fix what you can't see.</p>
    </div>
    <div className="flex justify-center mt-10">
          <button
            onClick={()=>document.getElementById('start').scrollIntoView({behavior:'smooth'})}
            className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-slate-900 text-white font-bold px-10 py-3 rounded-xl text-base transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5"
          >
            Take The Assessment <ChevronRight className="inline w-5 h-5 ml-1"/>
          </button>
        </div>
      </motion.div>
    </div>
    {/* ═══ 4 STYLES ═══ */}
<div className="bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-24">
  <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-100px'}} transition={{duration:0.8}} className="max-w-3xl mx-auto text-center">
    <p className="text-blue-400/90 text-sm font-semibold tracking-widest uppercase mb-6">Four Distinct Styles</p>
    <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight text-white">Which One Drives You?</h2>
    <p className="text-blue-200/70 mb-14 text-lg max-w-md mx-auto">Everyone leans towards one dominant style, often without knowing it.</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
      {[
        {name:'Dominator',bg:'from-red-600 to-red-700',border:'border-red-500/30',desc:'Drives hard for results. Decisive under pressure, but may leave value on the table by moving too fast.',icon:'⚡'},
        {name:'Integrator',bg:'from-purple-600 to-purple-700',border:'border-purple-500/30',desc:'Builds relationships and consensus. Creates trust, but may concede too much to keep the peace.',icon:'🤝'},
        {name:'Yielder',bg:'from-green-600 to-green-700',border:'border-green-500/30',desc:'Accommodating and patient. Keeps doors open, but risks being overlooked or outmanoeuvred.',icon:'🌿'},
        {name:'Calculator',bg:'from-blue-600 to-blue-700',border:'border-blue-500/30',desc:'Analytical and methodical. Masters the detail, but may delay momentum or miss the human dynamic.',icon:'📐'},
      ].map((s,i)=>(
            <motion.div key={s.name} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1,duration:0.6}}
              className={`bg-slate-800/50 ${s.border} border rounded-2xl p-6 text-left hover:bg-slate-800/80 transition-all`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`bg-gradient-to-r ${s.bg} w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-lg`}>{s.icon}</div>
                <h3 className="text-white font-bold text-lg">{s.name}</h3>
              </div>
              <p className="text-blue-100/50 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-blue-200/40 text-sm mt-10 italic">Your style is only the starting point, your unique archetype goes much deeper.</p>
      </motion.div>
    </div>

    {/* ═══ BENEFITS ═══ */}
    <div className="bg-slate-900 px-6 py-24">
  <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-100px'}} transition={{duration:0.8}} className="max-w-3xl mx-auto text-center">
    <p className="text-blue-400/90 text-sm font-semibold tracking-widest uppercase mb-6">Your Personalised Diagnostic</p>
    <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight text-white">This Isn't a Quiz.<br/>It's a Strategic Mirror.</h2>
    <p className="text-blue-200/70 text-lg mb-16 max-w-lg mx-auto">In 7 minutes you'll receive a detailed profile that most negotiators never get access to, giving you the EDGE.</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
      {[
        {title:'Your Negotiation DNA',desc:'Understand your dominant style, your secondary tendencies, and the archetype that makes you unique among the 12 profiles.',icon:'🧬'},
        {title:'Your Natural Edge',desc:"See exactly where your instincts serve you; the advantages most people in your style never consciously leverage.",icon:'🎯'},
        {title:'Your Blind Spots',desc:'Uncover the patterns that quietly erode trust, margin, or momentum before your next high stakes conversation.',icon:'🔍'},
        {title:'How to Read Others',desc:'Learn to identify each style across the table and adapt your approach in real time to create better outcomes for everyone.',icon:'🧭'},
      ].map((b,i)=>(
            <motion.div key={b.title} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1,duration:0.6}}
              className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
              <div className="text-2xl mb-3">{b.icon}</div>
              <h3 className="text-white font-bold text-base mb-2">{b.title}</h3>
              <p className="text-blue-100/50 text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* ═══ RESULTS PREVIEW / TEASER ═══ */}
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-24">
      <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-100px'}} transition={{duration:0.8}} className="max-w-2xl mx-auto text-center">
        <p className="text-blue-400/80 text-xs font-semibold tracking-widest uppercase mb-6">What You'll Receive</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 leading-tight text-white">A Profile Built Around You</h2>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-slate-800 via-slate-800/95 to-transparent z-10 flex items-end justify-center pb-8">
            <p className="text-blue-300/70 text-sm font-medium">Complete the assessment to unlock your full profile →</p>
          </div>
          <div className="text-left space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-red-600 to-red-700 w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg">⚡</div>
              <div>
                <p className="text-white font-bold text-lg">Primary: Dominator</p>
                <p className="text-blue-200/40 text-xs">Secondary: Calculator • Archetype: The Strategist</p>
              </div>
            </div>
            {[
              {label:'Dominator',pct:82,color:'bg-red-500'},
              {label:'Calculator',pct:64,color:'bg-blue-500'},
              {label:'Integrator',pct:41,color:'bg-purple-500'},
              {label:'Yielder',pct:23,color:'bg-green-500'},
            ].map((bar)=>(
              <div key={bar.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-100/60">{bar.label}</span>
                  <span className="text-blue-100/40">{bar.pct}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2">
                  <div className={`${bar.color} h-2 rounded-full`} style={{width:`${bar.pct}%`}}/>
                </div>
              </div>
            ))}
            <div className="pt-4">
              <p className="text-white font-semibold text-sm mb-2">Your Natural Edge</p>
              <p className="text-blue-100/40 text-sm">You bring decisiveness and momentum to negotiations that others often lack. Your instinct to...</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    {/* ═══ CREDIBILITY ═══ */}
    <div className="bg-slate-950 px-6 py-20">
      <motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:0.8}} className="max-w-2xl mx-auto text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14 text-blue-100/40 text-sm">
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-white">12+</span>
            <span className="text-xs uppercase tracking-widest">Years of Research</span>
          </div>
          <div className="hidden sm:block w-px h-12 bg-slate-700"/>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-white">12</span>
            <span className="text-xs uppercase tracking-widest">Unique Archetypes</span>
          </div>
          <div className="hidden sm:block w-px h-12 bg-slate-700"/>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold text-white">Free</span>
            <span className="text-xs uppercase tracking-widest">until 27 April 2026</span>
          </div>
        </div>
       <p className="text-blue-200/60 text-sm mt-8 max-w-md mx-auto leading-relaxed">
  Grounded in established behavioural science frameworks measured by psychologists and used by elite negotiators.
</p>
      </motion.div>
    </div>

{/* ═══ CTA — YOUR EXISTING BUTTON & INPUT ═══ */}
<div id="start" className="bg-white px-6 py-14 flex flex-col items-center">
  <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.4}} className="text-center max-w-md w-full">

    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Ready to See Yourself Clearly?</h2>
    <p className="text-slate-500 text-sm mb-10 max-w-xs mx-auto">7 minutes. 21 questions. A profile you'll reference before every important conversation.</p>

    <div className="mb-6">
      <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest">Your initials (optional)</label>
      <input
        type="text"
        value={userName}
        onChange={e=>setUserName(e.target.value.toUpperCase().replace(/[^A-Z]/g,'').slice(0,5))}
        maxLength={5}
        placeholder="e.g. JDS"
        className="w-72 px-5 py-3 border border-gray-200 rounded-lg text-center text-gray-700 bg-gray-50 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-50 focus:bg-white transition-all text-sm tracking-widest uppercase"
      />
    </div>

    <div className="mb-8">
      <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest">Your email address</label>
      <input
        type="email"
        value={userEmail}
        onChange={e=>{setUserEmail(e.target.value);setEmailError('');}}
        placeholder="you@example.com"
        className={`w-72 px-5 py-3 border rounded-lg text-center text-gray-700 bg-gray-50 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-50 focus:bg-white transition-all text-sm ${emailError ? 'border-red-400' : 'border-gray-200'}`}
      />
      {emailError && <p className="text-red-500 text-xs mt-2">{emailError}</p>}
      <p className="text-xs text-gray-400 mt-2">We'll send your full report here. No spam, ever.</p>
    </div>

    <button
      onClick={()=>{
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim());
        if(!valid){setEmailError('Please enter a valid email address');return;}
        setPhase('quiz');
      }}
      className="mb-6 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-slate-900 text-white font-bold px-12 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5"
    >
      Begin Assessment <ChevronRight className="inline w-5 h-5 ml-1"/>
    </button>

    <p className="text-xs text-gray-400 italic mb-8">Don't overthink it. Your first instinct is your truest answer.</p>

        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 uppercase tracking-widest">
        </div>

        <p className="text-xs text-gray-300 mt-12">&copy; 2026 The Buckingham Academy Limited</p>
      </motion.div>
    </div>

  </div>
);

  if(phase==='quiz'){
    const q=questions[qi];
    const pct=((qi)/questions.length)*100;
    return(
      <div className="min-h-screen bg-white text-gray-900 flex flex-col p-4">
        <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
          <div className="mb-6">
  <div className="flex justify-between text-sm text-gray-500 mb-2">
    <span>Question {qi+1} of {questions.length}</span>
    <span>{Math.round(pct)}%</span>
  </div>
  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
    <motion.div className="h-full bg-blue-700 rounded-full" initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.3}}/>
  </div>
<p className="text-sm text-gray-600 mt-3 text-center leading-relaxed">
  Pick the answer closest to how you would actually behave.<br/>
  <span className="font-bold text-gray-900">NOT</span> how you think you should.
</p>
</div>
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={qi} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}} transition={{duration:0.2}}>
                <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-900 leading-relaxed">{q.text}</h2>
                <div className="space-y-3">
                  {q.options.map((o,i)=>(
                    <button key={i} onClick={()=>setSel(i)}
  className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all duration-150 flex items-start gap-3 ${
    sel===i?'border-blue-700 bg-blue-50 text-blue-900':'border-gray-200 bg-white hover:border-gray-400 text-gray-700 hover:text-gray-900'
  }`}>
  <span className={`shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
    sel===i?'bg-blue-700 text-white':'bg-gray-200 text-gray-500'
  }`}>{String.fromCharCode(65+i)}</span>
  <span className="text-sm sm:text-base">{o.text}</span>
</button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-between mt-8 pb-4">
            <button onClick={back} disabled={qi===0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${qi===0?'text-gray-300 cursor-not-allowed':'text-gray-500 hover:text-gray-800'}`}>
              <ChevronLeft className="w-4 h-4"/>Back
            </button>
            <button onClick={next} disabled={sel===null}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                sel===null?'bg-gray-200 text-gray-400 cursor-not-allowed':'bg-blue-700 hover:bg-blue-800 text-white'
              }`}>
              {qi===questions.length-1?'See Results':'Next'}<ChevronRight className="w-4 h-4"/>
            </button>
          </div>
        </div>
      </div>
    );
  }
if(phase==='tiebreak'&&tieData) return(
  <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-2">One more question</h2>
    <p className="text-gray-500 mb-8">Your results are evenly split. Which description fits you best?</p>
    <div className="space-y-3 max-w-lg w-full">
      {tieData.tied.map(style=>(
        <button key={style} onClick={()=>{
          const sorted=Object.entries(tieData.scores).sort((a,b)=>
            b[1]-a[1] || (a[0]===style?-1:b[0]===style?1:0)
          );
          const p=sorted[0][0], s=sorted[1][0];
          const r={scores:tieData.scores,shadow:tieData.shadow,primary:p,secondary:s,archetype:archetypes[p+'-'+s]};
          setResults(r);
          setPhase('results');
        }}
          className="w-full text-left p-5 rounded-lg border-2 border-gray-200 hover:border-blue-700 hover:bg-blue-50 transition-all">
          <span className="font-bold" style={{color:styleMeta[style].color}}>{styleMeta[style].label}</span>
          <span className="text-gray-500 text-sm ml-2">
            {style==='dominator'&&'— I negotiate with directness to win the best deal possible'}
            {style==='integrator'&&'— I focus on collaboration and creative problem-solving'}
            {style==='yielder'&&'— I focus on empathasing with the other party and relationship-building'}
            {style==='calculator'&&'— I negotiate using thorough preparation and analysis'}
          </span>
        </button>
      ))}
    </div>
  </div>
);

  if(phase==='results'&&results){
    const{scores:sc,shadow:sh,primary:p,secondary:s,archetype:arch}=results;
    const sl=shadowLevels[sh];

  


    const shColors={green:'border-green-600 bg-green-50',yellow:'border-yellow-500 bg-yellow-50',amber:'border-amber-500 bg-amber-50',red:'border-red-600 bg-red-50'};
    const shTextColors={green:'text-green-700',yellow:'text-yellow-700',amber:'text-amber-700',red:'text-red-700'};
    const shC=shColors[sl.color]||shColors.green;
    const shT=shTextColors[sl.color]||shTextColors.green;

const renderParagraphs=(text)=>text.split('\n\n').map((para,i)=><p key={i} className={`text-gray-700 leading-relaxed ${i>0?'mt-3':''}`}>{para}</p>);

const renderWithQuote=(text)=>{
  const paragraphs=text.split('\n\n');
  const firstSentence=paragraphs[0].split('. ')[0]+'.';
  const restOfFirst=paragraphs[0].slice(firstSentence.length).trim();
  const allRemaining=[restOfFirst,...paragraphs.slice(1)].filter(p=>p.length>0).join(' ');
  const sentences=allRemaining.split('. ').filter(s=>s.trim().length>0);
  const mid=Math.ceil(sentences.length/2);
  const firstHalf=sentences.slice(0,mid).join('. ')+(sentences.length>1?'.':'');
  const secondHalf=sentences.slice(mid).join('. ')+(sentences.length>mid?'.':'');
  return(
    <>
      <p className="text-lg font-medium text-gray-900 border-l-4 border-blue-300 pl-4 mb-4 leading-relaxed italic">{firstSentence}</p>
      {firstHalf && <p className="text-gray-700 leading-relaxed">{firstHalf}</p>}
      {secondHalf && <p className="text-gray-700 leading-relaxed mt-4">{secondHalf}</p>}
    </>
  );
};


    return(
      <div className="min-h-screen bg-gray-50 text-gray-900 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto py-8">
         <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{duration:0.5,type:'spring'}} className="text-center mb-8 bg-white rounded-xl border-2 border-blue-700 p-8">
  {userName && <p className="text-gray-500 mb-2">Prepared for: <span className="font-bold text-gray-900">{userName}</span></p>}
  <p className="text-xs text-blue-700/60 font-semibold tracking-widest uppercase mb-4 text-center">Your Negotiation Archetype</p>
  <h1 className="text-3xl font-bold text-blue-800 mb-2">{arch.name}</h1>
  <p className="text-base text-gray-500 mb-4">{arch.tagline}</p>
  <div className="flex items-center justify-center gap-3">
    <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{backgroundColor:styleMeta[p].color}}>Primary: {styleMeta[p].label}</span>
    <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{backgroundColor:styleMeta[s].color}}>Secondary: {styleMeta[s].label}</span>
  </div>
</motion.div>

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
<h3 className="text-xs font-semibold text-blue-700/60 uppercase tracking-widest mb-4 text-center">Style Distribution</h3>
  <div style={{width:'100%',maxWidth:400,margin:'0 auto',aspectRatio:'1'}}>
    <PetalChart scores={sc}/>
  </div>
</motion.div>

<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
  <div className="space-y-4">
    {[
      {k:'dominator',label:'Dominator',color:'#DC2626',bg:'bg-red-600'},
      {k:'integrator',label:'Integrator',color:'#9333EA',bg:'bg-purple-600'},
      {k:'yielder',label:'Yielder',color:'#16A34A',bg:'bg-green-600'},
      {k:'calculator',label:'Calculator',color:'#2563EB',bg:'bg-blue-600'},
    ].map(a=>{
      const percent=Math.round((sc[a.k]/16)*100);
      return(
        <div key={a.k}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-bold" style={{color:a.color}}>{a.label}</span>
            <span className="text-sm font-bold" style={{color:a.color}}>{percent}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${a.bg}`}
              initial={{width:0}}
              animate={{width:`${percent}%`}}
              transition={{duration:0.8,delay:0.5}}
            />
          </div>
        </div>
      );
    })}
  </div>
</motion.div>


{/* Archetype Narrative */}
<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
  className="bg-gradient-to-r from-blue-50/50 to-white border border-blue-100 rounded-xl p-6 mb-4 border-l-4 border-l-blue-700">
  <h3 className="font-bold text-lg mb-3 text-blue-800">{arch.emoji} Your Archetype: {arch.name}</h3>
  {renderWithQuote(arch.narrative)}
</motion.div>

{/* Primary and Secondary side by side on desktop */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.38}}
    className="bg-white rounded-xl p-5 border-l-4" style={{borderLeftColor:styleMeta[p].color}}>
    <h3 className="font-bold text-base mb-2" style={{color:styleMeta[p].color}}>🎯 Primary: {styleMeta[p].label}</h3>
    <div className="text-sm text-gray-700 leading-relaxed">{renderParagraphs(stylePrimary[p])}</div>
  </motion.div>
  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.42}}
    className="bg-white rounded-xl p-5 border-l-4" style={{borderLeftColor:styleMeta[s].color}}>
    <h3 className="font-bold text-base mb-2" style={{color:styleMeta[s].color}}>🔀 Secondary: {styleMeta[s].label}</h3>
    <div className="text-sm text-gray-700 leading-relaxed">{renderParagraphs(styleSecondary[s])}</div>
  </motion.div>
</div>

{/* How Others See You */}
<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.46}}
  className="bg-white border-l-4 border-l-blue-700 rounded-xl p-6 mb-4">
  <h3 className="font-bold text-lg mb-3 text-blue-800">👥 How Others Experience You</h3>
  {renderWithQuote(arch.howOthersSeeYou)}
</motion.div>

{/* Strengths and Weaknesses side by side as bullets */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
    className="bg-green-50/50 border border-green-100 rounded-xl p-5 border-l-4 border-l-green-600">
    <h3 className="font-bold text-base mb-4 text-green-700">💪 Your Strengths</h3>
    <div className="space-y-3">
      {arch.strengths.split('. ').filter(s=>s.trim().length>10).map((s,i)=>(
        <div key={i} className="flex gap-2 items-start">
          <span className="shrink-0 text-green-600 mt-0.5">✓</span>
          <p className="text-sm text-gray-700 leading-relaxed">{s.trim().replace(/\.$/,'')}.</p>
        </div>
      ))}
    </div>
  </motion.div>
  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.54}}
    className="bg-red-50/30 border border-red-100 rounded-xl p-5 border-l-4 border-l-red-600">
    <h3 className="font-bold text-base mb-4 text-red-700">⚡ Your Weaknesses</h3>
    <div className="space-y-3">
      {arch.weaknesses.split('. ').filter(s=>s.trim().length>10).map((s,i)=>(
        <div key={i} className="flex gap-2 items-start">
          <span className="shrink-0 text-red-600 mt-0.5">✗</span>
          <p className="text-sm text-gray-700 leading-relaxed">{s.trim().replace(/\.$/,'')}.</p>
        </div>
      ))}
    </div>
  </motion.div>
</div>

{/* Blind Spots - distinct visual treatment */}
<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.58}}
  className="bg-purple-50/30 border border-purple-100 rounded-xl p-6 mb-4 border-l-4 border-l-purple-600">
  <h3 className="font-bold text-lg mb-3 text-purple-700">🔍 Your Blind Spots</h3>
  {renderWithQuote(arch.blindSpots)}
</motion.div>

{/* Under Pressure - warning style */}
<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.62}}
  className="bg-amber-50/30 border border-amber-100 rounded-xl p-6 mb-4 border-l-4 border-l-amber-500">
  <h3 className="font-bold text-lg mb-3 text-amber-700">🌡️ Under Pressure</h3>
  {renderWithQuote(arch.underPressure)}
</motion.div>

{/* Watch Out - alert style */}
<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.66}}
  className="bg-red-50/30 border border-red-100 rounded-xl p-6 mb-4 border-l-4 border-l-red-600">
  <h3 className="font-bold text-lg mb-3 text-red-700">⚠️ Watch Out</h3>
  {renderWithQuote(arch.watchOut)}
</motion.div>

{/* Growth Edge - action steps */}
<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.7}}
  className="bg-gradient-to-r from-green-50/50 to-emerald-50/30 border border-green-100 rounded-xl p-6 mb-4 border-l-4 border-l-green-600">
  <h3 className="font-bold text-lg mb-3 text-green-700">🌱 Your Growth Edge</h3>
  <p className="text-lg font-medium text-gray-900 border-l-4 border-green-300 pl-4 mb-5 leading-relaxed italic">
    {arch.growthEdge.split('. ')[0]}.
  </p>
  <div className="space-y-4">
    {arch.growthSteps.map((step,i)=>(
      <div key={i} className="flex gap-4 items-start">
        <div className="shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">{i+1}</div>
        <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
      </div>
    ))}
  </div>
  <div className="mt-5 pt-4 border-t border-green-200">
    <p className="text-sm text-gray-600 leading-relaxed">{arch.growthEdge.split('. ').slice(1).join('. ')}</p>
  </div>
</motion.div>

{/* Style Intensity Profile */}
<motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.25}}
  className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
  <h3 className="text-xs font-semibold text-blue-900/60 uppercase tracking-widest mb-1 text-center">Style Intensity Profile</h3>
  <p className="text-xs text-gray-500 text-center mb-6">This shows how strongly each negotiation style influences your behaviour at the table based upon your responses.</p>
  <div className="space-y-6">
    {['dominator','integrator','yielder','calculator'].map(style=>{
      const score=sc[style];
      const level=getStyleLevel(score);
      const meta=styleMeta[style];
      const lbl=levelLabels[level];
      const pct=Math.round((score/16)*100);
      return(
        <div key={style} className="border border-gray-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor:meta.color}}/>
              <span className="font-bold text-sm" style={{color:meta.color}}>{meta.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${lbl.bg}`} style={{color:lbl.color}}>{lbl.text}</span>
              <span className="text-sm font-bold text-gray-500">{pct}%</span>
            </div>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full rounded-full"
              style={{backgroundColor:meta.color}}
              initial={{width:0}}
              animate={{width:`${pct}%`}}
              transition={{duration:0.8,delay:0.4}}
            />
          </div>
         <p className="text-sm font-medium text-gray-800 mb-2">{meta.brief}</p>
         <p className="text-sm text-gray-600 leading-relaxed">{styleLevels[style][level]}</p>
        </div>
      );
    })}
  </div>
</motion.div>

{/* Reading The Room */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.0}}
            className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
            <h3 className="font-bold text-lg mb-2 text-blue-800">Reading The Room</h3>
            <p className="text-gray-500 text-sm mb-6">This section gives you your elite edge. Knowing yourself is a great start. But spotting others' negotiation style and adapting your approach is the skill of a master.</p>

            {/* 2x2 Spotting Grid */}
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Spot Their Style</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {['dominator','integrator','yielder','calculator'].map(style=>{
                const sg=spottingGuide[style];
                const sm=styleMeta[style];
                return(
                  <div key={style} className="border rounded-lg p-4" style={{borderColor:sm.color+'40',backgroundColor:sm.color+'08'}}>
                    <div className="font-bold text-sm mb-3" style={{color:sm.color}}>{sm.label}</div>
                    <div className="space-y-2 text-xs text-gray-700">
                      <div className="flex gap-2"><span className="font-semibold text-gray-500 w-12 shrink-0">Pace:</span><span>{sg.pace}</span></div>
                      <div className="flex gap-2"><span className="font-semibold text-gray-500 w-12 shrink-0">Tone:</span><span>{sg.tone}</span></div>
                      <div className="flex gap-2"><span className="font-semibold text-gray-500 w-12 shrink-0">Focus:</span><span>{sg.focus}</span></div>
                      <div className="mt-2">
                        <span className="font-semibold text-gray-500">You will hear:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {sg.phrases.map((ph,i)=><span key={i} className="px-2 py-0.5 rounded text-xs font-medium" style={{backgroundColor:sm.color+'15',color:sm.color}}>{ph}</span>)}
                        </div>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-500">They will:</span>
                        <div className="mt-1">{sg.behaviours.map((b,i)=><div key={i}>• {b}</div>)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Matchup Cards */}
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Your Tactical Playbook</h4>
            <div className="space-y-4">
              {['dominator','integrator','yielder','calculator']
                .filter(style=>style!==p)
                .map(opponent=>{
                  const key=p+'-'+opponent;
                  const m=matchupAdvice[key];
                  const oppMeta=styleMeta[opponent];
                  const myMeta=styleMeta[p];
                  return(
                    <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="px-5 py-3 flex items-center gap-3" style={{backgroundColor:myMeta.color+'10'}}>
                        <span className="font-bold text-sm" style={{color:myMeta.color}}>You ({myMeta.label})</span>
                        <span className="text-gray-400 text-sm">vs</span>
                        <span className="font-bold text-sm" style={{color:oppMeta.color}}>{oppMeta.label}</span>
                      </div>

                      <div className="p-5 space-y-4">
                        <div>
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Their Tells</h5>
                          <div className="space-y-1">{m.tells.map((t,i)=><div key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-gray-300">•</span><span>{t}</span></div>)}</div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Your Advantages</h5>
                            <div className="space-y-1">{m.advantages.map((a,i)=><div key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-green-500">✓</span><span>{a}</span></div>)}</div>
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Your Risks</h5>
                            <div className="space-y-1">{m.risks.map((r,i)=><div key={i} className="text-sm text-gray-700 flex gap-2"><span className="text-red-500">✗</span><span>{r}</span></div>)}</div>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Your Playbook</h5>
                          <div className="space-y-1">{m.playbook.map((step,i)=><div key={i} className="text-sm text-gray-700 flex gap-2"><span className="font-bold text-blue-700">{i+1}.</span><span>{step}</span></div>)}</div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <h5 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">⚠️ Watch For The Fake</h5>
                          <p className="text-sm text-amber-800">{m.fakeWarning}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* General Shadow Warning */}
            <div className="mt-6 bg-gray-900 text-white rounded-lg p-5">
              <h5 className="font-bold text-sm mb-2">The Most Important Rule</h5>
              <p className="text-sm text-gray-300">The most dangerous negotiator is not the one who is aggressive. It is the one who is pretending to be something they are not. If someone's words say collaboration but their proposals say competition, trust the proposals. If their warmth appeared suddenly and conveniently, question what it is designed to achieve. Behaviour reveals intention far more reliably than language ever will.</p>
            </div>
          </motion.div>

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.2}}
            className={`border-2 rounded-xl p-6 mb-6 ${shC}`}>
            <h3 className={`font-bold text-lg mb-1 ${shT}`}>Shadow Assessment: {sl.title}</h3>
            <p className={`font-semibold text-sm mb-3 ${shT}`}>{sl.sub} — Shadow Score: {sh}/5</p>
            {renderParagraphs(sl.msg)}
          </motion.div>

<motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.4}} className="flex flex-col items-center gap-3 mt-8 mb-4">
            
            {emailStatus === 'sending' && (
              <p className="text-sm text-blue-600 animate-pulse mb-4">📧 Sending report to {userEmail}...</p>
            )}
            {emailStatus === 'sent' && (
              <p className="text-sm text-green-600 mb-4">✅ Report sent to {userEmail}</p>
            )}
            {emailStatus === 'failed' && (
              <div className="text-center mb-4">
                <p className="text-sm text-red-500">❌ Failed to send email. Use the download button instead.</p>
                <button onClick={sendReportEmail} className="text-sm text-blue-600 underline mt-1">Try again</button>
              </div>
            )}
<button onClick={download} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-lg text-lg transition-colors shadow-lg">
              <Download className="w-5 h-5"/>Download as PDF
            </button>
          </motion.div>

          <div className="text-center text-xs text-gray-400 mt-8 pt-6 border-t border-gray-200">
            <p className="font-semibold">&copy; 2026 The Buckingham Academy Limited. All rights reserved.</p>
            <p className="mt-1">To hear about our negotiation coaching email us: admin@bucademy.com</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
}