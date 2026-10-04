/* Chapter 1: Through the Glass.
 *
 * The approved text (docs/chapters/01-through-the-glass.md) cut into graphic-novel panels, per
 * the frame contract in docs/build.md. Each frame is one moment: a drawn scene, a written
 * storyboard (`board`) for a future illustrator, short captions, speech balloons and sound
 * effects, and exactly one interaction. Frame ids run in reading order; branch frames carry a
 * letter, one per option (f015a…f015e), and a branch that runs two panels continues with the
 * next letter (f046c → f046d, then back to f047).
 *
 * Reading order inside a panel: captions first, then balloons in order. So a line that reacts
 * to a balloon goes in the next panel, and a choice's spoken option is not echoed as a balloon
 * (the label already said it), except where the panel has no caption (the worry replies).
 *
 * Text conventions: second person, present tense ("you"); typographic apostrophes and quotes
 * (’ “ ” …) so nothing needs escaping. tests/story.test.js checks all of this;
 * tools/storyboard.mjs turns it into docs/storyboard/ch01.md.
 */
(function (root) {
  var PC = root.PC || (root.PC = {});
  PC.story = PC.story || {};

  /* One cast member: who, pose, mood, anchor, facing, plus optional size/variant. */
  function c(who, pose, mood, at, facing, extra) {
    var o = { who: who, pose: pose };
    if (mood) o.mood = mood;
    o.at = at;
    o.facing = facing;
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) o[k] = extra[k];
    return o;
  }
  /* One scene: set, camera, options, cast, effects. */
  function S(set, cam, opts, cast, fx) {
    return { set: set, cam: cam, opts: opts || {}, cast: cast || [], fx: fx || [] };
  }

  var frames = {

    /* ------------------------------------------------------------------ The window */

    f001: {
      scene: S('room', 'cushion', { door: 'closed' },
        [c('player', 'sit', 'dreamy', 'cushion', 'right')], ['sunset']),
      board: 'MEDIUM SHOT. Our cat, drawn in the reader’s chosen look, sits on a round squashy cushion at left, side-on, gazing right through a tall glass patio door with a dreamy half-smile. Sunset pours through the glass in long orange and pink stripes across the rug, a lamp glows behind, and a leafy potted plant leans in at the edge. Caption box top left, over the warm wall.',
      caption: ['Every evening you sit in the same spot: the warm cushion by the big glass door, where the garden begins.'],
      next: 'f002'
    },

    f002: {
      scene: S('room', 'outside', { door: 'closed' },
        [], ['sunset']),
      board: 'POV, OVER THE SHOULDER. We look past the back of our cat’s ears, through the glass, at the garden and the city beyond: glass towers blazing orange, and three airplanes in a slow diagonal line drifting down toward an unseen river. The lawn, the hedge, the fence and a lamp post sit dark green in the foreground. A soft wavy “hmmmmm” floats along the line of planes; captions top left.',
      caption: [
        'Outside, the glass towers glow orange in the sunset.',
        'Airplanes drift down over the river, one after another, humming through the glass.'
      ],
      sfx: 'hmmmmmm',
      next: 'f003'
    },

    f003: {
      scene: S('room', 'outside', { door: 'closed', clan: true },
        [], ['dusk']),
      board: 'POV THROUGH THE GLASS. The same view a few minutes later: the sky has gone violet and the towers have switched on their windows. Down in the garden, tiny cat silhouettes slip along the hedge and the top of the fence, small enough that you have to hunt for them, like a puzzle picture. Our cat’s nose and whiskers press against the glass at the bottom edge, leaving a little fog patch; caption at the top.',
      caption: ['And in the garden, if you watch very carefully, the wild cats come out.'],
      next: 'f004'
    },

    f004: {
      scene: S('room', 'glass', { door: 'closed', clan: true },
        [c('player', 'peer', 'dreamy', 'glass', 'right')], ['dusk']),
      board: 'CLOSE-UP ON THE GLASS, WITH INSETS. Our cat’s face is pressed to the glass at lower left; across the darkening pane float three round memory insets, like pictures in a locket: a big ginger tabby counting sparrows on a fence, a silver cat sitting like a queen on a stone fountain, and two apprentices pouncing at a leaf and missing it. Twilight blue and violet, with warm lamp light on our cat’s fur. Captions run across the top of the pane.',
      caption: [
        'You’ve watched them for moons.',
        'A big ginger tabby who counts the sparrows out loud. A silver leader who sits on the old stone fountain like a queen. Apprentices who pounce on leaves, and miss.'
      ],
      next: 'f005'
    },

    f005: {
      scene: S('room', 'glass', { door: 'closed' },
        [c('player', 'peer', 'dreamy', 'glass', 'right')], ['dusk']),
      board: 'CLOSE-UP. Our cat’s face in profile, nose almost touching the glass, eyes big and a little wistful. Through the glass behind, out of focus, the garden glows violet and gold. Two small caption boxes are stacked at top right, with plenty of quiet space around them.',
      caption: ['You know every one of them.', 'Not one of them knows you.'],
      next: 'f006'
    },

    f006: {
      scene: S('tower', 'up', {},
        [c('player', 'lookup', 'wonder', 'window', 'right'), c('waffles', 'peer', 'shout', 'railing', 'left')], ['dusk']),
      board: 'LOW ANGLE, TALL PANEL. Outside, looking straight up the side of a glass tower at dusk: at the very bottom our cat’s small face peeks up from behind the ground-floor window, and nineteen floors above, a tiny fluffy white head pokes over a balcony railing. The tower glass reflects pink clouds and one passing airplane, and the floors stack up dizzily like a ladder of light. A big zigzag “PSSST!” runs down the glass from the balcony, and the balloon’s tail stretches all the way up to it; caption at the bottom, near the window.',
      caption: ['The voice comes from far, far above.'],
      sfx: 'PSSST!',
      say: [{ who: 'waffles', text: 'Down there! Pillow cat!', kind: 'shout' }],
      next: 'f007'
    },

    f007: {
      scene: S('tower', 'balcony', {},
        [c('waffles', 'peer', 'happy', 'railing', 'left')], ['dusk']),
      board: 'MEDIUM CLOSE-UP. Princess Waffles fills the panel: a huge cloud of white fur, a flat squashed face, round copper eyes and a pink bow, her chin resting on the balcony railing with both front paws dangling over. Behind her the city spreads out in sunset colors: towers, the river, a tiny airplane. Captions top left; leave room on the right for her balloons in the next panels.',
      caption: [
        'Nineteen floors up, a fluffy white face peers over a balcony railing.',
        'It’s Princess Waffles. She has never touched grass, and she has never once stopped talking.'
      ],
      next: 'f008'
    },

    f008: {
      scene: S('tower', 'balcony', {},
        [c('waffles', 'sit', 'proud', 'railing', 'left')], ['sunset']),
      board: 'MEDIUM. Waffles sits up very tall on the balcony like a TV presenter, one paw raised as if holding a microphone, eyes half closed with drama. A dusky pink sky behind her and a potted geranium beside her. Two balloons stack down the right, with the show’s title lettered big and swirly.',
      say: [
        { who: 'waffles', text: 'Today on AS THE GARDEN TURNS…' },
        { who: 'waffles', text: 'The big ginger one counted FORTY-TWO sparrows, and the leader looked VERY impressed.' }
      ],
      next: 'f009'
    },

    f009: {
      scene: S('tower', 'balcony', {},
        [c('waffles', 'fall', 'dreamy', 'railing', 'left')], ['sunset']),
      board: 'MEDIUM, COMEDY BEAT. Waffles has flopped onto her back on the balcony tiles, paws in the air, one paw draped across her forehead like a fainting movie star. Between the railing bars the city glows. Her balloons float just above her fluffy tummy.',
      say: [
        { who: 'waffles', text: 'And an apprentice fell in the birdbath.' },
        { who: 'waffles', text: 'Thrilling. I had to lie down.' }
      ],
      next: 'f010'
    },

    f010: {
      scene: S('tower', 'up', {},
        [c('player', 'peer', 'dreamy', 'window', 'right'), c('waffles', 'peer', 'sniff', 'railing', 'left')], ['dusk']),
      board: 'LOW ANGLE. Our cat fills the bottom of the panel behind the ground-floor window, chin on paws, eyes fixed longingly on the garden, the very picture of wanting-to-go-outside; far up the tower, Waffles leans over her railing to look down. Lamps are coming on in the tower windows one by one. Caption at the top, and Waffles’ balloon trails a long tail down to our cat.',
      caption: ['Waffles peers down at you.'],
      say: [{ who: 'waffles', text: 'You’re doing the face again, darling. The wanting-to-go-outside face.' }],
      next: 'f011'
    },

    f011: {
      scene: S('room', 'glass', { door: 'closed', reflection: true },
        [c('player', 'peer', 'wonder', 'glass', 'right')], ['dusk']),
      board: 'CLOSE-UP ON THE GLASS. Our cat sits nose to nose with its own reflection in the darkening glass, the evening garden faintly visible through it. The reflection is whatever the reader chooses, she-cat or tom, fur, marking and eyes, and it is redrawn live as they choose. Captions at the top; the chooser sits below the panel.',
      caption: ['You catch your reflection in the glass.', 'What does Waffles see?'],
      look: { next: 'f012' }
    },

    f012: {
      scene: S('tower', 'balcony', {},
        [c('waffles', 'peer', 'neutral', 'railing', 'left')], ['dusk']),
      board: 'MEDIUM CLOSE-UP. Waffles leans over the railing with one whisker raised like an eyebrow, head tilted, waiting for an answer. City lights twinkle behind her as the sky turns violet. Balloon at the top; the pet-name chooser sits below the panel.',
      say: [{ who: 'waffles', text: 'And what does the Tall One call you these days? Remind me.' }],
      input: {
        kind: 'petname',
        suggestions: ['Muffin', 'Snickerdoodle', 'Mittens', 'Biscuit', 'Sir Pounce-a-lot'],
        next: 'f013'
      }
    },

    f013: {
      scene: S('tower', 'balcony-close', {},
        [c('waffles', 'loaf', 'dreamy', 'railing', 'left')], ['dusk']),
      board: 'CLOSE-UP. Waffles’ flat face resting on her paws on the railing, eyes half lidded, with her sigh drawn as a little puff of breath. Her pink bow droops a bit. The pet name sits in the first balloon; a beat of space, then the second balloon.',
      caption: ['Waffles sighs.'],
      say: [
        { who: 'waffles', text: '{petname}.' },
        { who: 'waffles', text: 'Adorable. Utterly un-wild.' }
      ],
      next: 'f014'
    },

    f014: {
      scene: S('room', 'wide', { door: 'closed' },
        [c('player', 'loaf', 'happy', 'cushion', 'right')], ['dusk']),
      board: 'WIDE. The whole cozy room at cat height, with a clue to each of a pillow cat’s days hidden in it: a laundry basket with one sock dangling out, curtains with tell-tale claw snags, a dripping kitchen tap through a doorway, and the big window with a bird feeder beyond it. Our cat loafs on the cushion in the middle, looking pleased with itself. Caption top left; the choices sit below the panel.',
      caption: ['What did you do all day, as a pillow cat?'],
      choice: {
        options: [
          { label: 'Watched the birds through the glass.', sets: { specialty: 'noticing' }, next: 'f015a' },
          { label: 'Hid in the laundry basket and ambushed socks.', sets: { specialty: 'sneaking' }, next: 'f015b' },
          { label: 'Climbed the curtains. The Tall One was NOT pleased.', sets: { specialty: 'climbing' }, next: 'f015c' },
          { label: 'Played in the dripping kitchen tap, the only cat in the towers who likes water.', sets: { specialty: 'swimming' }, next: 'f015d' },
          { label: 'Chatted with Princess Waffles for hours and hours.', sets: { specialty: 'friends' }, next: 'f015e' }
        ]
      }
    },

    f015a: {
      scene: S('tower', 'up', {},
        [c('player', 'peer', 'neutral', 'window', 'right'), c('waffles', 'peer', 'worried', 'railing', 'left')], ['dusk']),
      board: 'LOW ANGLE. Our cat at the ground-floor window stares up with a perfectly unblinking, laser-steady gaze; nineteen floors up, Waffles leans back from the railing a little, unnerved. A row of birds on a wire between them freezes mid-chirp. Balloon at the top by Waffles.',
      say: [{ who: 'waffles', text: 'You do have a stare. It’s unsettling. I mean that as a compliment.' }],
      next: 'f016'
    },

    f015b: {
      scene: S('tower', 'balcony', {},
        [c('waffles', 'sit', 'laugh', 'railing', 'left')], ['dusk']),
      board: 'MEDIUM. Waffles cackles on her balcony, one paw pressed to her chest; a small inset bubble shows our cat bursting out of a laundry basket with a striped sock in its jaws. Warm violet dusk. Balloon at the top right.',
      say: [{ who: 'waffles', text: 'Legendary. Nobody’s socks are safe.' }],
      next: 'f016'
    },

    f015c: {
      scene: S('tower', 'up', {},
        [c('player', 'sit', 'proud', 'window', 'right'), c('waffles', 'peer', 'laugh', 'railing', 'left')], ['dusk']),
      board: 'LOW ANGLE. Our cat sits proudly at the ground-floor window, a few curtain threads still caught on its claws; high above, Waffles hangs over the railing, shaking with laughter. Behind the window glass, the shredded hem of a curtain is just visible. Balloon at the top.',
      say: [{ who: 'waffles', text: 'I heard about the curtains. The whole building heard about the curtains.' }],
      next: 'f016'
    },

    f015d: {
      scene: S('tower', 'balcony', {},
        [c('waffles', 'flat', 'scared', 'railing', 'left')], ['dusk']),
      board: 'MEDIUM, COMEDY BEAT. Waffles recoils from the railing as if someone has offered her a bath, fur puffed out to twice its size, bow askew. A tiny water drop is drawn above her head like a warning sign. Balloon at the top right.',
      say: [{ who: 'waffles', text: 'Water. On purpose. You are a mystery to me.' }],
      next: 'f016'
    },

    f015e: {
      scene: S('tower', 'balcony', {},
        [c('waffles', 'sit', 'proud', 'railing', 'left')], ['dusk']),
      board: 'MEDIUM. Waffles preens on her balcony with her nose in the air, deeply satisfied, smoothing her bow with one paw. The city sparkles behind her like an audience. Balloon at the top right.',
      say: [{ who: 'waffles', text: 'Obviously. The best use of anyone’s time.' }],
      next: 'f016'
    },

    /* ------------------------------------------------------------------ The open door */

    f016: {
      scene: S('room', 'wide', { door: 'open' },
        [c('player', 'sit', 'wonder', 'cushion', 'left'), c('tallone', 'water', null, 'doorway', 'left')], ['dusk']),
      board: 'WIDE, AT CAT HEIGHT. The Tall One is only slippers, pajama legs and one hand, sliding the tall glass door open while a green watering can swings from the other hand; little music notes float down from above the frame. Our cat on the cushion twists round, ears up. Cool blue evening air spills in through the gap against the room’s warm lamplight; the sfx runs along the door track.',
      caption: ['Behind you, the Tall One hums a little song and slides the glass door open to water her plants.'],
      sfx: 'SHHHK',
      next: 'f017'
    },

    f017: {
      scene: S('room', 'glass', { door: 'open' },
        [c('player', 'sit', 'sniff', 'glass', 'right')], ['dusk']),
      board: 'EXTREME CLOSE-UP. Our cat’s nose and whiskers at the open gap of the door, nostrils working, eyes closed in concentration. Ribbons of scent drift in from the garden, drawn as faint green, blue and gold wisps. Captions follow the wisps across the top.',
      caption: ['Cool evening air pours in.', 'It smells of leaves, and river, and something wild.'],
      next: 'f018'
    },

    f018: {
      scene: S('room', 'cushion', { door: 'open' },
        [c('player', 'crouch', 'wonder', 'floor', 'right'), c('moth', 'fly', null, 'glass', 'right')], ['dusk']),
      board: 'MEDIUM. A pale, powdery moth zigzags past our cat’s face toward the open door, trailing a dotted flight line. Our cat drops into a crouch on the rug, eyes huge, the tip of its tail twitching. Beyond the doorway the garden is blue and inviting; caption top left, choices below the panel.',
      caption: ['A moth flutters past your nose, out the door, into the garden.'],
      choice: {
        options: [
          { label: 'Chase the moth!', sets: { stepOut: 'chase' }, next: 'f019a' },
          { label: 'Step out slowly, one paw at a time.', sets: { stepOut: 'slow' }, next: 'f019b' }
        ]
      }
    },

    f019a: {
      scene: S('garden', 'step', { moth: true },
        [c('player', 'crouch', 'happy', 'step', 'right')], ['dusk', 'motion']),
      board: 'MEDIUM, ACTION. Mid-leap out of the doorway: our cat flies through the air over the patio step, all four legs stretched, ears back with joy, chasing the moth that flutters just out of reach. Speed lines stream behind, and the open door and warm room light frame the left side. The caption ends on an ellipsis at bottom right, pulling the eye to the next panel.',
      caption: ['You bound after it and land, all four paws at once, in…'],
      sfx: 'WHOOSH!',
      next: 'f020'
    },

    f019b: {
      scene: S('garden', 'step', {},
        [c('player', 'walk', 'wonder', 'doorway', 'right')], ['dusk']),
      board: 'MEDIUM, SLOW. Our cat steps over the threshold with one forepaw lifted high, whiskers brushing the doorframe, eyes wide. The warm room glows behind and the cool blue garden waits ahead. The caption at bottom right ends on an ellipsis.',
      caption: ['The doorframe slides past your whiskers, and you are standing in…'],
      next: 'f020'
    },

    f020: {
      scene: S('garden', 'paws', {},
        [c('player', 'stand', 'wonder', 'lawn', 'right')], ['dusk']),
      board: 'EXTREME CLOSE-UP. Four soft paws sink into cool grass, blades poking up between the toes, a few dewdrops catching the last of the light. Nothing else is in the panel. One single word in a caption, centered, with lots of space around it.',
      caption: ['Grass.'],
      next: 'f021'
    },

    f021: {
      scene: S('garden', 'wide', { sparrows: 12 },
        [c('player', 'stand', 'happy', 'lawn', 'right')], ['dusk']),
      board: 'WIDE. Our cat stands in the middle of the lawn with every hair fluffed out, eyes shining, tail straight up like a flag. The garden opens all around: the dark hedge, the fence, a lamp post just flickering on, glass towers glowing above. Caption boxes stack at top left, with WONDERFUL lettered bigger and bolder than the rest.',
      caption: [
        'You have never touched grass. It is prickly. It is cold. It is a little bit wet.',
        'It is the most WONDERFUL thing you have ever felt.'
      ],
      next: 'f022'
    },

    f022: {
      scene: S('tower', 'balcony-close', {},
        [c('waffles', 'stand', 'shout', 'railing', 'left')], ['dusk']),
      board: 'CLOSE-UP, CUTAWAY. Waffles on her balcony, both front paws thrown up in the air, mouth wide, bow bouncing. A cloud of loose white fluff explodes around her. A big jagged shout balloon; the caption sits small at the top, as if the sound has traveled a long way.',
      caption: ['From nineteen floors up comes a faint, faraway shriek of joy.'],
      say: [{ who: 'waffles', text: '{THEY}’S DOING IT! REAL GRASS!', kind: 'shout' }],
      next: 'f023'
    },

    f023: {
      scene: S('garden', 'step', {},
        [c('player', 'sit', 'wonder', 'lawn', 'left'), c('tallone', 'stand', null, 'doorway', 'right')], ['dusk']),
      board: 'LOW ANGLE. From the grass, past our cat’s ear in the foreground, we look back at the open patio door: the Tall One stands in the doorway, seen only from the knees down, slippers on the warm step and the green watering can hanging still. Golden lamplight spills out around those legs onto the step. Captions top right.',
      caption: [
        'Something makes you look back.',
        'The Tall One stands in the doorway with her watering can. She watches you for a long moment.'
      ],
      next: 'f024'
    },

    f024: {
      scene: S('garden', 'step', { dish: true },
        [c('tallone', 'set-dish', null, 'step', 'left')], ['dusk']),
      board: 'INSERT. A gentle hand lowers a small blue dish of water onto the patio step, and the water catches the lamplight in a little gold ripple. Behind it, the glass door is open just a crack, warm light slicing through the gap. A tiny “tink” by the dish; caption along the top.',
      caption: ['Then she smiles a small smile, sets a dish of water on the warm step, and leaves the door open a crack.'],
      sfx: 'tink',
      next: 'f025'
    },

    f025: {
      scene: S('garden', 'wide', { dish: true },
        [c('player', 'sit', 'kind', 'lawn', 'left')], ['dusk', 'glow']),
      board: 'WIDE. The whole garden seen from a little above: our cat sits small on the lawn, looking back at the house, where the crack of golden light from the door and the dish on the step glow like a nightlight. The rest of the garden is soft blue dusk. Captions sit in the quiet sky.',
      caption: ['You don’t know how Tall Ones know things.', 'But she knows.'],
      next: 'f026'
    },

    /* ------------------------------------------------------------------ Thirteen sparrows */

    f026: {
      scene: S('garden', 'wide', { sparrows: 12, lampSparrow: true, dish: true },
        [c('player', 'walk', 'wonder', 'lawn', 'right', { size: 0.8 })], ['dusk']),
      board: 'HIGH ANGLE WIDE. Looking down on the garden: our cat is a small shape crossing a huge lawn, the hedge rises like a dark green wall, and long blue shadows stretch from the fence and the lamp post. Little pools of lamplight keep it cozy rather than scary. Captions top left.',
      caption: ['The garden is bigger from the inside.', 'The hedge is taller. The shadows are deeper.'],
      next: 'f027'
    },

    f027: {
      scene: S('garden', 'fence', { sparrows: 12, lampSparrow: true },
        [c('tallyheart', 'lookup', 'neutral', 'fence-foot', 'right')], ['dusk']),
      board: 'MEDIUM. A row of twelve plump sparrows, fluffed for bed, sits along the top of the wooden fence; below them, a big ginger tabby with a torn left ear sits looking up, lips moving, one paw tapping the air as she counts. Soft dusk light, with the lamp post glowing at the right edge. Captions top left; her small whispery balloon near her mouth.',
      caption: [
        'On the fence, a row of sparrows is settling down for the night.',
        'Below them sits the big ginger tabby, counting under her breath.'
      ],
      say: [{ who: 'tallyheart', name: 'The ginger cat', text: '…ten, eleven, twelve. Twelve sparrows.', kind: 'whisper' }],
      next: 'f028'
    },

    f028: {
      scene: S('garden', 'lamp', { sparrows: 12, lampSparrow: true }, [], ['dusk', 'glow']),
      board: 'POV CLOSE-UP. Through our cat’s eyes: the top of the lamp post and, tucked beside the glowing lamp, a thirteenth sparrow puffed into a perfect round ball like a dandelion clock, only its tiny beak and tail showing. The lamplight makes a soft halo around it. Caption at the bottom; the choice sits below the panel.',
      caption: ['You look again. There’s one more, half hidden on top of the lamp post, fluffed up like a dandelion.'],
      choice: {
        options: [
          { label: '“Thirteen! There’s one on the lamp!”', sets: { spokeUp: true }, next: 'f029a' },
          { label: 'Stay very, very quiet.', sets: { spokeUp: false }, next: 'f029b' }
        ]
      }
    },

    f029a: {
      scene: S('garden', 'meet', { sparrows: 12, lampSparrow: true },
        [c('player', 'sit', 'shout', 'lawn', 'right'), c('tallyheart', 'sit', 'wonder', 'fence-foot', 'left')], ['dusk']),
      board: 'MEDIUM TWO-SHOT. At left, our cat sits bolt upright, one paw still pointing up at the lamp post; at right, the big ginger tabby has turned, both ears swiveled forward, eyes wide with surprise and just starting to soften into a grin. Above them, the thirteenth sparrow on the lamp. Caption at the top; her two balloons follow, the second one softer.',
      caption: ['The ginger cat’s ears swivel toward you. She looks at the lamp. She looks at you.'],
      say: [
        { who: 'tallyheart', name: 'The ginger cat', text: 'Thirteen…' },
        { who: 'tallyheart', name: 'The ginger cat', text: 'Sharp eyes.' }
      ],
      next: 'f030'
    },

    f029b: {
      scene: S('garden', 'meet', { sparrows: 12, lampSparrow: true },
        [c('player', 'flat', 'worried', 'lawn', 'right'), c('tallyheart', 'sit', 'sniff', 'fence-foot', 'right')], ['dusk']),
      board: 'MEDIUM. Our cat lies flat behind a clump of grass at left, eyes squeezed tight, trying very hard to be invisible. At right, the ginger tabby has not turned round at all, but her nose is lifted and twitching, drawn with little sniff lines. Her balloons come from the back of her head.',
      caption: ['You don’t make a sound. But the ginger cat’s nose twitches. She doesn’t even turn around.'],
      say: [
        { who: 'tallyheart', name: 'The ginger cat', text: 'Soap.' },
        { who: 'tallyheart', name: 'The ginger cat', text: 'And… tuna.' }
      ],
      next: 'f029c'
    },

    f029c: {
      scene: S('garden', 'meet', { sparrows: 12, lampSparrow: true },
        [c('player', 'crouch', 'worried', 'lawn', 'right'), c('tallyheart', 'sit', 'kind', 'fence-foot', 'left')], ['dusk']),
      board: 'MEDIUM TWO-SHOT. Now the ginger tabby turns, amused, one whisker cocked; our cat creeps out of the grass with its ears a little flat and answers in a small voice. The sparrows watch from the fence. Three balloons zigzag between them.',
      say: [
        { who: 'tallyheart', name: 'The ginger cat', text: 'Come out, little pillow cat. How many sparrows do you see?' },
        { who: 'player', text: 'Thirteen.' },
        { who: 'tallyheart', name: 'The ginger cat', text: 'Sharp eyes.' }
      ],
      next: 'f030'
    },

    f030: {
      scene: S('garden', 'meet', {},
        [c('player', 'lookup', 'wonder', 'lawn', 'right'), c('tallyheart', 'sit', 'kind', 'fence-foot', 'left', { size: 1.35 })], ['dusk']),
      board: 'LOW ANGLE. From our cat’s height, Tallyheart towers over the frame: a big, broad ginger tabby with a cream chest, a ragged notch torn from her left ear and warm amber eyes, smiling down. Behind her the sky is deep blue with the very first star out. Caption top left; her balloon to the right of her head.',
      caption: ['Up close, she is enormous, with a torn ear and the kindest eyes you have ever seen.'],
      say: [{ who: 'tallyheart', text: 'I’m Tallyheart. I count things. Pawsteps, sparrows, stars.' }],
      next: 'f031'
    },

    f031: {
      scene: S('garden', 'fence', { sparrows: 12, lampSparrow: true },
        [c('player', 'sit', 'happy', 'lawn', 'right'), c('tallyheart', 'sit', 'laugh', 'fence-foot', 'left')], ['dusk']),
      board: 'MEDIUM. Under the row of sleepy sparrows, Tallyheart laughs at her own story, eyes crinkled, and a small inset bubble near her balloon shows a tiny ginger kit in a heap of littermates, counting them on its paws. Our cat listens, enchanted. Balloon at the top right.',
      say: [{ who: 'tallyheart', text: 'My mother named me Tallykit, because I wouldn’t stop counting my brothers and sisters.' }],
      next: 'f032'
    },

    f032: {
      scene: S('garden', 'meet', {},
        [c('player', 'sit', 'neutral', 'lawn', 'right'), c('tallyheart', 'sit', 'kind', 'fence-foot', 'left')], ['dusk']),
      board: 'CLOSE-UP. Tallyheart tilts her big ginger head and studies our cat with sudden sharp interest, amber eyes narrowed but kind, torn ear cocked. Far behind her, across the dusky lawn, glows the glass door of our cat’s home. Caption top left; balloon beside her head.',
      caption: ['She tilts her head.'],
      say: [{ who: 'tallyheart', text: 'You’ve been watching us through the glass. Every evening, for moons.' }],
      next: 'f033'
    },

    f033: {
      scene: S('garden', 'meet', {},
        [c('player', 'sit', 'wonder', 'lawn', 'right'), c('tallyheart', 'walk', 'happy', 'fence-foot', 'right')], ['dusk']),
      board: 'CLOSE-UP. Our cat’s face at left, eyes wide and ears straight up in surprise; at right, Tallyheart is already turning away toward the hedge, glancing back with a wink. Deep blue dusk, with the lamp making a warm rim of light on both of them. Caption top left, balloon top right.',
      caption: ['You didn’t know she’d seen you.'],
      say: [{ who: 'tallyheart', text: 'Counting cats notice things. Come on. Let’s see what Glintstar makes of you.' }],
      next: 'f034'
    },

    /* ------------------------------------------------------------------ Behind the hedge */

    f034: {
      scene: S('garden', 'hedge', {},
        [c('tallyheart', 'walk', 'happy', 'hedge-gap', 'right')], ['dusk']),
      board: 'MEDIUM. Tallyheart’s ginger hindquarters and striped tail disappear into a low, dark tunnel in the hedge, and our cat follows close behind, whiskers brushing the leaves. Through the gap glows a mysterious golden light. Captions top left, the second one sitting right by the glowing gap.',
      caption: [
        'Tallyheart slips through a gap in the hedge you never knew was there. You follow.',
        'On the other side, the garden goes wild.'
      ],
      next: 'f035'
    },

    f035: {
      scene: S('camp', 'reveal', {},
        [c('player', 'stand', 'wonder', 'entrance', 'right', { size: 0.8 }),
         c('tallyheart', 'stand', 'happy', 'center', 'left', { size: 0.8 }),
         c('glintstar', 'sit', 'neutral', 'fountain-top', 'left')], ['sunset', 'glow']),
      board: 'WIDE ESTABLISHING SPLASH. The hidden camp: bramble arches curve over shadowy den mouths, giant ferns fan out, and mossy stepping-stone paths wind toward a dry, three-tiered stone fountain in the middle, where a sleek silver cat sits perfectly still. Everything is lit gold and green by low sunlight slanting between the towers. Our cat is small at the bottom left, just through the hedge, and Tallyheart waits a little ahead, looking back; captions top left.',
      caption: [
        'Brambles arch over secret dens. Ferns grow taller than you. Moss covers the old stone paths.',
        'On the dry fountain in the middle sits a silver cat, watching everything.'
      ],
      next: 'f036'
    },

    f036: {
      scene: S('camp', 'purr', {},
        [c('glintstar', 'sit', 'neutral', 'fountain-top', 'left', { size: 0.7 }),
         c('clancat', 'loaf', 'neutral', 'crowd-left', 'right', { variant: 1, size: 0.7 }),
         c('clancat', 'sit', 'neutral', 'crowd-right', 'left', { variant: 4, size: 0.7 }),
         c('clancat', 'walk', 'neutral', 'ferns', 'left', { variant: 6, size: 0.7 })], ['sunset', 'glow']),
      board: 'HIGH ANGLE WIDE. Pulling up and back: the hidden garden is a small wild green square, and glass towers rise all around it like crystal cliffs, lit gold on one side. Dozens of tiny cats dot the camp. The name CrystalClan is lettered big and proud across the bottom, like a title.',
      caption: [
        'Glass towers rise all around, golden in the last of the light.',
        'But down here, hidden from every Tall One in the world, is a whole Clan of cats.',
        'CrystalClan.'
      ],
      next: 'f037'
    },

    f037: {
      scene: S('camp', 'crowd', {},
        [c('clancat', 'crouch', 'sniff', 'crowd-left', 'right', { variant: 2 }),
         c('clancat', 'stand', 'stern', 'crowd-right', 'left', { variant: 5 }),
         c('snorter', 'sit', 'neutral', 'center', 'left')], ['sunset']),
      board: 'MEDIUM WIDE, POV. From our cat’s height, a half circle of Clan cats has crept out of the bramble dens: tabbies, a tortoiseshell, a black-and-white youngster, all staring straight at us with narrowed eyes. Whiskers bristle and one nose stretches forward, sniffing. Captions top left; the sfx floats beside the stretched-out nose.',
      caption: ['Cats come out of the dens to stare.', 'Whiskers twitch. Somebody sniffs.'],
      sfx: 'sniff… sniff…',
      next: 'f038'
    },

    f038: {
      scene: S('camp', 'crowd', {},
        [c('clancat', 'stand', 'stern', 'crowd-left', 'right', { variant: 3 }),
         c('mutterer', 'sit', 'sniff', 'center', 'right'),
         c('snorter', 'sit', 'laugh', 'crowd-right', 'left')], ['sunset']),
      board: 'MEDIUM. Three Clan cats lean together, whispering not very quietly: a stern grey tabby, a small tortoiseshell apprentice wrinkling her nose, and a black-and-white apprentice tom smirking down at our cat’s paws. The light is golden but their shadows are long. Three balloons overlap and crowd each other, like the gossip.',
      say: [
        { who: 'clancat', text: 'That’s a pillow cat.' },
        { who: 'mutterer', name: 'A small apprentice', text: '{They} smells like soap.' },
        { who: 'snorter', name: 'A cheeky apprentice', text: 'Look at those soft paws. {They}’s never caught a thing in {their} life.' }
      ],
      next: 'f039'
    },

    f039: {
      scene: S('camp', 'fountain', {},
        [c('glintstar', 'stand', 'stern', 'fountain-top', 'left')], ['sunset']),
      board: 'LOW ANGLE. Looking up the stone fountain at Glintstar as she rises to her paws on the top basin: sleek silver fur, a long elegant tail, pale ice-blue eyes that almost seem to glow. The sky behind her has turned deep gold and violet, and the towers frame her like the pillars of a throne room. Captions down the left side.',
      caption: [
        'The silver cat on the fountain stands.',
        'This is Glintstar, leader of CrystalClan, and her eyes are the color of the river in winter.'
      ],
      next: 'f040'
    },

    f040: {
      scene: S('camp', 'crowd', {},
        [c('glintstar', 'sit', 'stern', 'fountain-top', 'left'), c('tallyheart', 'stand', 'proud', 'fountain-foot', 'right')], ['sunset']),
      board: 'LOW ANGLE TWO-SHOT. Glintstar on the fountain top, cool and still; Tallyheart at the fountain’s foot, chest out and chin up, not one bit embarrassed. Glintstar’s balloon at the top, Tallyheart’s firm answer below it.',
      say: [
        { who: 'glintstar', text: 'Tallyheart. Why have you brought a pillow cat into our camp?' },
        { who: 'tallyheart', text: 'Because {they} saw a sparrow I missed.' }
      ],
      next: 'f041'
    },

    f041: {
      scene: S('camp', 'crowd', {},
        [c('glintstar', 'peer', 'stern', 'fountain-top', 'left'), c('player', 'lookup', 'worried', 'fountain-foot', 'right'),
         c('clancat', 'sit', 'laugh', 'crowd-left', 'right', { variant: 3 })], ['sunset']),
      board: 'LOW ANGLE, OVER THE SHOULDER. From just behind our cat at the foot of the fountain, we look up the mossy stone tiers to Glintstar, who leans down from the top and fixes our cat with her pale eyes while a Clan cat at the edge of the panel snickers behind a paw. Our cat’s ears are back and its tail is wrapped tight around its paws. Captions top left, Glintstar’s balloon dropping in from the top, our cat’s small balloon rising from below.',
      caption: ['A few cats laugh. Glintstar doesn’t.', 'She looks down at you.'],
      say: [
        { who: 'glintstar', text: 'What is your name, pillow cat?' },
        { who: 'player', text: '{petname}.' }
      ],
      next: 'f042'
    },

    f042: {
      scene: S('camp', 'entrance', {},
        [c('player', 'sit', 'worried', 'entrance', 'right', { size: 0.85 })], ['sunset']),
      board: 'HIGH ANGLE WIDE. From above, our cat sits alone in the middle of the mossy clearing, ringed by perfectly still, staring Clan cats. Nobody moves, and a single leaf drifts down. A tiny “chirp… chirp…” comes from a cricket in the corner; caption top center.',
      caption: ['There is a very long silence.'],
      sfx: 'chirp… chirp…',
      next: 'f043'
    },

    f043: {
      scene: S('camp', 'fountain-close', {},
        [c('glintstar', 'sit', 'solemn', 'fountain-top', 'left')], ['sunset', 'glow']),
      board: 'CLOSE-UP. Glintstar’s noble silver face, utterly serious, chin lifted, eyes half closed, as if pronouncing the name of a great queen. A single golden sunbeam lights her like a statue. The pet name sits in an elegant balloon with lots of space around it.',
      caption: ['Glintstar repeats it, with tremendous dignity.'],
      say: [{ who: 'glintstar', text: '{petname}.' }],
      next: 'f044'
    },

    f044: {
      scene: S('camp', 'ferns', {},
        [c('snorter', 'fall', 'laugh', 'ferns', 'right')], ['sunset', 'motion']),
      board: 'MEDIUM, COMEDY BEAT. A black-and-white apprentice tom tumbles backward out of a clump of giant ferns, legs in the air, eyes squeezed shut, cheeks puffed out with a snort of laughter. Fern fronds and a couple of startled beetles fly everywhere. Big wobbly sfx lettering bursts out of the ferns; caption top left.',
      caption: ['Somewhere in the ferns, an apprentice snorts so hard he falls over.'],
      sfx: 'SNORRRT!',
      next: 'f045'
    },

    f045: {
      scene: S('camp', 'reveal', {},
        [c('glintstar', 'stand', 'stern', 'fountain-top', 'left'), c('player', 'sit', 'neutral', 'fountain-foot', 'right')], ['sunset']),
      board: 'LOW ANGLE. Glintstar leans down from the top of the fountain, eyes narrowed, testing; our cat sits up straight at the fountain’s foot with its paws together. The gold light is fading toward violet. Balloon at the top; the choice sits below the panel.',
      say: [{ who: 'glintstar', text: 'Why should CrystalClan take in a pillow cat?' }],
      choice: {
        options: [
          { label: '“I want to learn everything. Hunting, borders, all of it.”', sets: { joinReason: 'learn' }, next: 'f046a' },
          { label: '“I counted the sparrows. I can learn to count anything.”', sets: { joinReason: 'count' }, next: 'f046b' },
          { label: '“I’m braver than I look.”', sets: { joinReason: 'brave' }, next: 'f046c' }
        ]
      }
    },

    f046a: {
      scene: S('camp', 'crowd', {},
        [c('glintstar', 'sit', 'kind', 'fountain-top', 'left'), c('player', 'stand', 'happy', 'fountain-foot', 'right')], ['dusk']),
      board: 'MEDIUM TWO-SHOT. Our cat leans eagerly forward with both front paws planted; up on the fountain, Glintstar’s whiskers twitch at the corners, the smallest hint of a smile on her stern face. The caption sits by her whiskers, her balloon just below it.',
      say: [
        { who: 'glintstar', text: 'Everything is a great deal. But wanting to learn is a start.' }
      ],
      caption: ['Glintstar’s whiskers twitch.'],
      next: 'f047'
    },

    f046b: {
      scene: S('camp', 'crowd', {},
        [c('glintstar', 'sit', 'neutral', 'fountain-top', 'left'), c('player', 'sit', 'proud', 'fountain-foot', 'right'),
         c('tallyheart', 'sit', 'proud', 'crowd-right', 'left')], ['dusk']),
      board: 'MEDIUM THREE-SHOT. Our cat sits proudly at the fountain’s foot; Glintstar’s cool eyes slide sideways to Tallyheart, who puffs up her ginger chest at the edge of the panel and looks extremely pleased with herself. Caption at the top, Glintstar’s balloon below it.',
      say: [
        { who: 'glintstar', text: 'Tallyheart’s own gift. Interesting.' }
      ],
      caption: ['Glintstar glances at the ginger cat.'],
      next: 'f047'
    },

    f046c: {
      scene: S('camp', 'crowd', {},
        [c('glintstar', 'sit', 'kind', 'fountain-top', 'left'), c('player', 'sit', 'proud', 'fountain-foot', 'right')], ['dusk']),
      board: 'MEDIUM. Our cat sits up very tall with its chest puffed out, trying to look as large as possible; Glintstar looks down with a dry, considering look and murmurs her reply. Caption top left; her balloon small and quiet.',
      caption: ['Glintstar murmurs.'],
      say: [{ who: 'glintstar', text: 'You would have to be.' }],
      next: 'f046d'
    },

    f046d: {
      scene: S('camp', 'purr', {},
        [c('clancat', 'sit', 'laugh', 'crowd-left', 'right', { variant: 2 }), c('clancat', 'loaf', 'laugh', 'crowd-right', 'left', { variant: 6 }),
         c('player', 'sit', 'proud', 'center', 'right')], ['dusk']),
      board: 'MEDIUM. Around the clearing a few Clan cats chuckle, eyes crinkled and warm, not mean, and one nudges its neighbor. In the middle, our cat sits a little taller anyway. Caption top left; a soft sfx of chuckles.',
      caption: ['A few cats laugh, but not unkindly.'],
      sfx: 'heh heh heh',
      next: 'f047'
    },

    f047: {
      scene: S('camp', 'crowd', {},
        [c('tallyheart', 'stand', 'proud', 'center', 'right'), c('player', 'sit', 'wonder', 'crowd-right', 'left')], ['dusk']),
      board: 'MEDIUM, HEROIC. Tallyheart strides into the middle of the clearing and plants herself beside our cat, tail high, chest out, torn ear proud. The watching cats lean back in surprise. Caption top left; her balloon big and firm.',
      caption: ['Tallyheart steps forward.'],
      say: [{ who: 'tallyheart', text: 'Let {them} try. I’ll teach {them} myself.' }],
      next: 'f048'
    },

    f048: {
      scene: S('camp', 'crowd', {},
        [c('grizzled', 'sit', 'stern', 'crowd-left', 'right'), c('tallyheart', 'stand', 'stern', 'center', 'left'),
         c('player', 'sit', 'worried', 'crowd-right', 'left')], ['dusk']),
      board: 'MEDIUM TWO-SHOT. At left, a grizzled old dark-brown tom with a grey muzzle and a scar over one eye growls, ears back; at right, Tallyheart turns to face him, steady and calm, not angry. Between and behind them, our cat watches. His balloon is spiky; hers is smooth and solid.',
      caption: ['A grizzled old tom growls.'],
      say: [
        { who: 'grizzled', text: '{They} was born behind glass.' },
        { who: 'tallyheart', text: 'So? Judge {them} by what {they} does, not by where {they} sleeps.' }
      ],
      next: 'f049'
    },

    f049: {
      scene: S('camp', 'fountain', {},
        [c('glintstar', 'sit', 'neutral', 'fountain-top', 'left')], ['dusk']),
      board: 'CLOSE-UP. Glintstar’s face, thoughtful, eyes closed for a long beat; above the towers behind her, the first stars are coming out in the violet sky (no moon: it is a moonless night). Her balloon is small and very clear.',
      caption: ['Glintstar is quiet for a long moment. Then she nods.'],
      say: [{ who: 'glintstar', text: 'One moon.' }],
      next: 'f050'
    },

    f050: {
      scene: S('camp', 'reveal', {},
        [c('glintstar', 'stand', 'stern', 'fountain-top', 'left'), c('player', 'sit', 'proud', 'fountain-foot', 'right'),
         c('tallyheart', 'sit', 'happy', 'entrance', 'right'),
         c('clancat', 'sit', 'neutral', 'crowd-right', 'left', { variant: 4 })], ['dusk']),
      board: 'WIDE. The whole camp in violet dusk, every cat turned toward the fountain, where Glintstar stands to give her ruling. Our cat, small at the fountain’s foot, sits up straighter, eyes shining with determination. Glintstar’s balloon at the top; leave the bottom of the panel quiet.',
      say: [{ who: 'glintstar', text: 'Until the full moon, and the Gathering. Learn our ways. Keep the Accord. Then we will see if you belong here.' }],
      next: 'f051'
    },

    f051: {
      scene: S('camp', 'entrance', {},
        [c('player', 'sit', 'proud', 'entrance', 'right', { size: 1.2 })], ['dusk']),
      board: 'CLOSE-UP. Our cat’s face fills the panel, chin up, whiskers forward, eyes shining with determination, the violet camp soft and blurred behind. A first star prickles above one ear. Two captions, the second a little bigger than the first.',
      caption: ['One moon.', 'You can do anything for one moon.'],
      next: 'f052'
    },

    /* ------------------------------------------------------------------ Your Clan name */

    f052: {
      scene: S('camp', 'crowd', {},
        [c('glintstar', 'sit', 'kind', 'fountain-top', 'left'), c('player', 'lookup', 'wonder', 'fountain-foot', 'right')], ['dusk']),
      board: 'LOW ANGLE. Glintstar on the fountain top, her expression softer now, tail curled around her paws; our cat at the foot looks up, thinking hard. The first star shows above the towers. Balloon at the top; the name entry sits below the panel.',
      say: [{ who: 'glintstar', text: 'Pillow names don’t hunt. A cat who joins CrystalClan chooses a Clan name. What shall we call you?' }],
      input: {
        kind: 'clanname',
        suggestions: ['Moon', 'Fern', 'Minnow', 'Frost', 'Pebble', 'Sedge', 'Storm', 'Holly'],
        next: 'f053'
      }
    },

    f053: {
      scene: S('camp', 'fountain', {},
        [c('glintstar', 'stand', 'shout', 'fountain-top', 'left')], ['dusk', 'glow']),
      board: 'LOW ANGLE, BIG MOMENT. Glintstar stands tall on the top of the fountain, head thrown back, calling out over the camp; the last gold light catches the edges of her fur so she seems to glow. Below, cat ears all over camp swivel toward her. Her balloon is big and bold, with the new name lettered larger than the rest.',
      say: [{ who: 'glintstar', text: 'Cats of CrystalClan! From this night, this cat is {name}paw.', kind: 'shout' }],
      next: 'f054'
    },

    f054: {
      scene: S('camp', 'reveal', {},
        [c('glintstar', 'stand', 'proud', 'fountain-top', 'left'), c('player', 'stand', 'wonder', 'center', 'right'),
         c('tallyheart', 'sit', 'happy', 'entrance', 'right'),
         c('clancat', 'sit', 'happy', 'crowd-right', 'left', { variant: 1 })], ['dusk']),
      board: 'WIDE. The whole Clan gathered round the fountain; Tallyheart, grinning, has nudged our cat forward into the middle of the clearing, and Glintstar stretches her tail toward them in welcome. Every face is turned to our cat. Balloon from the fountain top; leave the bottom of the panel open.',
      say: [{ who: 'glintstar', text: 'Tallyheart will teach {them} to hunt, to guard our borders, and to know {their} Counts. Welcome {them}!' }],
      next: 'f055'
    },

    f055: {
      scene: S('camp', 'purr', {},
        [c('glintstar', 'sit', 'kind', 'fountain-top', 'left', { size: 0.8 }),
         c('player', 'sit', 'happy', 'center', 'right', { size: 0.8 }),
         c('tallyheart', 'sit', 'happy', 'entrance', 'right', { size: 0.8 }),
         c('clancat', 'loaf', 'happy', 'crowd-left', 'right', { variant: 2, size: 0.8 }),
         c('clancat', 'sit', 'happy', 'crowd-right', 'left', { variant: 5, size: 0.8 }),
         c('snorter', 'loaf', 'happy', 'ferns', 'left', { size: 0.8 })], ['dusk', 'purr']),
      board: 'WIDE, WHOLE CAMP. Every cat in camp has closed its eyes and is purring: soft golden ripple lines spread out from each one, den to den, overlapping until the whole garden seems to hum with warmth. Our cat sits in the middle, eyes shining, glowing at the center of all the ripples. The “purrrrr” sfx curls through the panel like a ribbon, and the new name sits in a caption at the bottom, lettered large.',
      caption: [
        'One by one, the cats begin to purr.',
        'The sound spreads from den to den, low and warm, until the whole wild garden is humming your new name.',
        '{name}paw.'
      ],
      sfx: 'purrrrrrrr',
      next: 'f056'
    },

    f056: {
      scene: S('tower', 'balcony-close', {},
        [c('waffles', 'crouch', 'shout', 'railing', 'left')], ['dusk']),
      board: 'CLOSE-UP, CUTAWAY. Back on the nineteenth-floor balcony, Waffles is a sobbing ball of fluff, happy tears streaming down her flat face, while a small and very surprised hairball sits on the tiles in front of her. City lights twinkle behind. The “HURK!” sfx is wobbly and green; her balloon is a big wail.',
      caption: ['Far above, a tiny voice wails.'],
      say: [{ who: 'waffles', text: 'I’m CRYING, darling! I’ve coughed up a hairball!', kind: 'shout' }],
      sfx: 'HURK!',
      next: 'f057'
    },

    /* ------------------------------------------------------------------ The Counts */

    f057: {
      scene: S('hollow', 'wide', {},
        [c('tallyheart', 'walk', 'happy', 'sand-right', 'right'), c('player', 'walk', 'wonder', 'sand-left', 'right')], ['sunset']),
      board: 'WIDE. A soft, sandy bowl at the edge of camp, ringed with roots and moss, under an old crooked tree that leans over it like a grandparent bending down to listen. One last warm patch of sunlight lies on the sand. Tallyheart pads down into the hollow with our cat following; caption top left.',
      caption: ['Tallyheart leads you to a sandy hollow at the edge of camp, under an old tree that leans over it like it’s listening.'],
      next: 'f058'
    },

    f058: {
      scene: S('hollow', 'lesson', {},
        [c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('player', 'sit', 'wonder', 'sand-right', 'left')], ['sunset']),
      board: 'MEDIUM TWO-SHOT. Tallyheart sits tall at left like a teacher, one paw raised; at right, our cat tilts its head, one ear up and one ear sideways in confusion. Warm late light, with the sand glittering. Balloons left, then right.',
      say: [
        { who: 'tallyheart', text: 'Every warrior learns two things first. The hunter’s crouch, and the Counts.' },
        { who: 'player', text: 'Counts?' }
      ],
      next: 'f059'
    },

    f059: {
      scene: S('hollow', 'lesson', {},
        [c('tallyheart', 'crouch', 'proud', 'sand-left', 'right'), c('player', 'crouch', 'wonder', 'sand-right', 'left')], ['sunset']),
      board: 'MEDIUM. Tallyheart drops into a perfect hunter’s crouch to show how, belly low and tail straight out behind. Our cat copies her, wobbly and a bit lopsided, with its tail sticking straight up. Two balloons stack on the right.',
      say: [
        { who: 'tallyheart', text: 'The crouch feeds you. The Counts feed your whole Clan.' },
        { who: 'tallyheart', text: 'Know your Counts, and you can share the prey pile fairly. You’ll know when a patrol comes home one cat short.' }
      ],
      next: 'f060'
    },

    f060: {
      scene: S('hollow', 'lesson', {},
        [c('tallyheart', 'sit', 'proud', 'sand-left', 'right', { size: 1.2 })], ['sunset', 'sparkle']),
      board: 'EXTREME CLOSE-UP. Just Tallyheart’s amber eyes and the ragged edge of her torn ear, with a glint of light flashing across them, knowing and a little mysterious. Everything else is shadow and warm gold. Caption top left; balloon below the eyes.',
      caption: ['Tallyheart’s eyes glint.'],
      say: [{ who: 'tallyheart', text: 'And you can always tell when something’s missing. Remember that.' }],
      next: 'f061'
    },

    f061: {
      scene: S('hollow', 'wide', {},
        [c('tallyheart', 'stand', 'kind', 'sand-left', 'right'),
         c('clancat', 'curl', 'sleepy', 'sunpatch', 'left', { variant: 1 }),
         c('clancat', 'loaf', 'sleepy', 'sand-right', 'left', { variant: 4 }),
         c('clancat', 'curl', 'sleepy', 'tree', 'right', { variant: 6 })], ['sunset', 'zzz']),
      board: 'MEDIUM WIDE. Tallyheart stands at left and points with her long striped tail, like a teacher’s pointer, at three Clan cats dozing in the sun: one long fluffy tail, one thin striped tail and one short stubby tail, each curled a different way. Little zzz float above the sleepers. Caption top left; her balloon by Tallyheart.',
      caption: ['She points her tail at three cats dozing in the last patch of sun.'],
      say: [
        { who: 'tallyheart', text: 'We start with tails. Every cat has one tail. Even pillow cats.' }
      ],
      next: 'f062'
    },

    f062: {
      scene: S('hollow', 'lesson', {},
        [c('tallyheart', 'sit', 'kind', 'sand-left', 'right'), c('player', 'crouch', 'happy', 'sand-right', 'left')], ['sunset']),
      board: 'MEDIUM, LESSON. Tallyheart and our cat face each other across a smooth patch of sand, Tallyheart sitting like a patient teacher and our cat crouched forward with its paws ready. For each question, a picture of cats in a row, one tail each, appears above the sand; after a miss, Tallyheart scratches one line per tail in the sand and counts them out loud with our cat. Caption at the top; the keypad sits below the panel.',
      caption: ['Your first Count: tails.'],
      counts: { set: 'ch01-tails', next: 'f063' }
    },

    f063: {
      scene: S('hollow', 'tree', { marks: 1 },
        [], ['sunset']),
      board: 'INSERT, CLOSE ON THE TRUNK. Two big ginger forepaws reach up into the panel from below, claws out, and score one clean, fresh claw mark into the bark of the old leaning tree, sending tiny curls of bark springing away. Above the scratch the bark is smooth and empty, with room for many more marks. The “SKRITCH!” runs along the new scratch; caption top left.',
      caption: ['When you’re done, Tallyheart stretches up and scratches a single claw mark into the leaning tree.'],
      sfx: 'SKRITCH!',
      next: 'f064'
    },

    f064: {
      scene: S('hollow', 'wide', { marks: 1, glow: true },
        [c('tallyheart', 'sit', 'kind', 'tree', 'left'), c('player', 'lookup', 'wonder', 'sand-left', 'right')], ['sunset', 'glow', 'sparkle']),
      board: 'WIDE. The whole sandy hollow in the last light: on the old leaning tree the single new claw mark shimmers with a faint gold glow for just a heartbeat, as if the tree is making a promise. Tallyheart sits proud and kind at the foot of the trunk, and our cat gazes up at the mark. Her balloons rise along the trunk, the second one bigger.',
      say: [
        { who: 'tallyheart', text: 'That’s your first Count. The tails.' },
        { who: 'tallyheart', text: 'One day this tree will have a mark for every Count you know, and they’ll glow.' }
      ],
      next: 'f065'
    },

    /* ------------------------------------------------------------------ The worry */

    f065: {
      scene: S('den', 'outside', { weather: 'clear' },
        [c('tallyheart', 'stand', 'kind', 'entrance-left', 'right'), c('player', 'stand', 'wonder', 'entrance-right', 'left')], ['night', 'stars']),
      board: 'WIDE. Night has come: an enormous old rosebush humps up like a green hill, with a dark, cozy hollow at its roots and a few late pink roses glowing in the starlight. Tallyheart and our cat stand at the entrance, and Tallyheart turns back with a soft, serious look. Captions top left, in a deep blue sky.',
      caption: [
        'Tallyheart walks you to the apprentices’ den, a hollow under an enormous rosebush.',
        'Then she stops and looks at you with her kind eyes.'
      ],
      next: 'f066'
    },

    f066: {
      scene: S('den', 'doorway', { weather: 'clear' },
        [c('tallyheart', 'sit', 'kind', 'entrance-left', 'right'), c('player', 'sit', 'worried', 'entrance-right', 'left')], ['night', 'stars']),
      board: 'MEDIUM, FROM INSIDE THE DEN. Looking out through the rosebush doorway, framed by leaves and late roses against the starry night: Tallyheart has sat down to be nearer our cat’s height, head tilted, amber eyes kind, and our cat looks down at its own paws, unsure. A few fireflies drift past outside. Balloon from Tallyheart; the choice sits below the panel.',
      say: [{ who: 'tallyheart', text: 'Everyone’s scared of something on their first night. What’s yours?' }],
      choice: {
        options: [
          { label: '“What if I’m too small?”', sets: { worry: 'small' }, next: 'f067a' },
          { label: '“The river. It looks so deep.”', sets: { worry: 'water' }, next: 'f067b' },
          { label: '“When I’m nervous, I talk and talk and talk.”', sets: { worry: 'talk' }, next: 'f067c' },
          { label: '“Shiny things. I can’t stop looking at them.”', sets: { worry: 'shiny' }, next: 'f067d' }
        ]
      }
    },

    f067a: {
      scene: S('den', 'doorway', { weather: 'clear' },
        [c('tallyheart', 'sit', 'kind', 'entrance-left', 'right'), c('player', 'loaf', 'worried', 'entrance-right', 'left', { size: 0.85 })], ['night', 'stars']),
      board: 'MEDIUM TWO-SHOT, FROM INSIDE THE DEN. Our cat makes itself small and round as it speaks; Tallyheart answers with a warm smile, nodding toward a tiny gap in the rosebush that only a small cat could fit through. Balloons alternate between them.',
      say: [
        { who: 'player', text: 'What if I’m too small?' },
        { who: 'tallyheart', text: 'Small cats fit where big cats can’t. You’ll see.' }
      ],
      next: 'f068'
    },

    f067b: {
      scene: S('den', 'doorway', { weather: 'clear' },
        [c('tallyheart', 'sit', 'kind', 'entrance-left', 'right'), c('player', 'sit', 'worried', 'entrance-right', 'left')], ['night', 'stars']),
      board: 'MEDIUM TWO-SHOT, FROM INSIDE THE DEN. Our cat glances off toward the dark river beyond the camp; Tallyheart lays one big paw gently beside our cat’s small one on the moss. A thin silver line of river shines in the far distance. Balloons alternate between them.',
      say: [
        { who: 'player', text: 'The river. It looks so deep.' },
        { who: 'tallyheart', text: 'Then we’ll take it one paw at a time.' }
      ],
      next: 'f068'
    },

    f067c: {
      scene: S('den', 'doorway', { weather: 'clear' },
        [c('tallyheart', 'sit', 'laugh', 'entrance-left', 'right'), c('player', 'sit', 'worried', 'entrance-right', 'left')], ['night', 'stars']),
      board: 'MEDIUM TWO-SHOT, FROM INSIDE THE DEN. Our cat’s balloon is drawn stuffed to bursting, words spilling over its edge; Tallyheart laughs a big warm laugh and answers with a firm, approving nod. Starlight on both of them. Balloons alternate between them.',
      say: [
        { who: 'player', text: 'When I’m nervous, I talk and talk and talk.' },
        { who: 'tallyheart', text: 'Good. A Clan needs a cat who’ll speak up.' }
      ],
      next: 'f068'
    },

    f067d: {
      scene: S('den', 'doorway', { weather: 'clear' },
        [c('tallyheart', 'sit', 'kind', 'entrance-left', 'right'), c('player', 'sit', 'dreamy', 'entrance-right', 'left')], ['night', 'stars', 'sparkle']),
      board: 'MEDIUM TWO-SHOT, FROM INSIDE THE DEN. Mid-sentence, our cat’s eyes have already drifted to a dewdrop glittering on a rose leaf; Tallyheart follows the look and smiles knowingly. The dewdrop gets a little star-shaped sparkle. Balloons alternate between them.',
      say: [
        { who: 'player', text: 'Shiny things. I can’t stop looking at them.' },
        { who: 'tallyheart', text: 'Then you’ll be the first to notice when something sparkles that shouldn’t.' }
      ],
      next: 'f068'
    },

    /* ------------------------------------------------------------------ The Sky River */

    f068: {
      scene: S('den', 'outside', { weather: 'clear' },
        [c('tallyheart', 'lookup', 'kind', 'entrance-left', 'right'), c('player', 'sit', 'wonder', 'entrance-right', 'left')], ['night', 'stars']),
      board: 'MEDIUM. Tallyheart tips her head right back to look at the sky, and our cat, puzzled, starts to follow her gaze. The top of the panel is cropped, so we cannot see the sky yet. Caption top left; her short balloon at her chin.',
      caption: ['Before you go in, Tallyheart tips her head back.'],
      say: [{ who: 'tallyheart', text: 'Look up.' }],
      next: 'f069'
    },

    f069: {
      scene: S('sky', 'up', {}, [], ['night', 'stars', 'skyriver']),
      board: 'WIDE SPLASH, ALMOST ALL SKY. The Sky River pours across the whole panel from corner to corner: a glittering band of blue, violet and silver light made of countless stars, with the rosebush and the tips of the towers only a dark fringe along the bottom edge. This is the most beautiful panel in the chapter, so give it room. Captions small, at top left and bottom right.',
      caption: ['You’ve seen stars before, through the glass, a few at a time.', 'You have never seen this.'],
      next: 'f070'
    },

    f070: {
      scene: S('sky', 'cats', {},
        [c('tallyheart', 'lookup', 'kind', 'ground-left', 'right'), c('player', 'lookup', 'wonder', 'ground-right', 'left')], ['night', 'stars', 'skyriver']),
      board: 'WIDE, FROM BEHIND. Two cats sit side by side on a little rise of grass, seen from behind: big ginger Tallyheart and our smaller cat, both heads tilted all the way back. Above them the Sky River fills the sky. Caption top left; Tallyheart’s small balloon is soft-edged, tucked into the starlight.',
      caption: ['The sky is enormous. Across the whole of it runs a river of light: glittering, shimmering, a thousand thousand stars.'],
      say: [{ who: 'tallyheart', text: 'The Sky River.', kind: 'whisper' }],
      next: 'f071'
    },

    f071: {
      scene: S('sky', 'cats', {},
        [c('tallyheart', 'sit', 'kind', 'ground-left', 'right'), c('player', 'lookup', 'wonder', 'ground-right', 'left')], ['night', 'stars', 'skyriver']),
      board: 'MEDIUM, FROM THE SIDE. Tallyheart’s face in soft starlight, gazing up, gentle and a little solemn, while our cat looks from her to the sky and back. One star in the river shines a touch brighter than the rest, as if it is listening. Her balloons are soft-edged and quiet.',
      say: [
        { who: 'tallyheart', text: 'The cats who came before us live there. They watch over the Clans.' },
        { who: 'tallyheart', text: 'And sometimes, if you’re lucky, they send you a dream.' }
      ],
      next: 'f072'
    },

    f072: {
      scene: S('sky', 'cats', {},
        [c('tallyheart', 'sit', 'laugh', 'ground-left', 'right'), c('player', 'sit', 'happy', 'ground-right', 'left')], ['night', 'stars', 'skyriver']),
      board: 'MEDIUM, FROM THE SIDE. Tallyheart raises a paw toward the sky mid-count, then bursts out laughing, eyes crinkled, while our cat giggles beside her. A shooting star streaks across one corner. Caption top left; her balloon round and bouncy.',
      caption: ['She starts to count the stars, then laughs.'],
      say: [{ who: 'tallyheart', text: 'Even I can’t count those.' }],
      next: 'f073'
    },

    /* ------------------------------------------------------------------ The storm */

    f073: {
      scene: S('den', 'inside', { weather: 'clear' },
        [c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'), c('mutterer', 'curl', 'sleepy', 'sleeper-2', 'left'),
         c('player', 'peer', 'wonder', 'doorway', 'left')], ['night', 'zzz']),
      board: 'WIDE, INSIDE THE DEN. A snug cave of rose stems and leaves lined with mossy nests, lit only by a little blue starlight through the doorway. Two apprentices are curled asleep in their nests, and our cat peeks in at the doorway. Caption top left; little zzz rise from the sleepers.',
      caption: ['The apprentices’ den smells of moss and rose leaves.', 'Two apprentices are already asleep.'],
      next: 'f074'
    },

    f074: {
      scene: S('den', 'inside', { weather: 'clear' },
        [c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right'), c('mutterer', 'curl', 'sleepy', 'sleeper-2', 'left')], ['night', 'zzz']),
      board: 'MEDIUM, COMEDY. Two sleeping apprentices: a skinny grey tom flat on his back with his mouth wide open, his snore drawn as a huge rattling sfx that shakes the leaves, and a small tortoiseshell she-cat curled up tight with her paws twitching, muttering in a tiny dreamy balloon. A loose rose petal flutters in the snore. Captions top left and bottom right.',
      caption: [
        'A skinny grey tom snores like the Tall One’s vacuum cleaner.',
        'A little she-cat mutters in her sleep.'
      ],
      sfx: 'SNRRRK-WHEEE!',
      say: [{ who: 'mutterer', text: 'Mice… mice… mice…', kind: 'whisper' }],
      next: 'f075'
    },

    f075: {
      scene: S('den', 'nest', { weather: 'clear' },
        [c('player', 'curl', 'happy', 'nest', 'right')], ['night']),
      board: 'CLOSE-UP. Our cat curls nose to tail in a fresh round nest of green moss, with three little curved arrows showing the turn, turn, turn before lying down. A content, sleepy smile, and one rose leaf for a blanket. Captions top left in the dark.',
      caption: [
        'You make a nest of moss, turn around three times, and curl up.',
        'It isn’t a cushion. But it’s yours.'
      ],
      next: 'f076'
    },

    f076: {
      scene: S('den', 'outside', { weather: 'cloudy' }, [], ['night']),
      board: 'WIDE. The rosebush den from outside, very late: a heavy bank of cloud rolls across the sky and swallows the Sky River, star by star. The camp below is dark and still, with one cozy glow of moss light inside the den. One caption alone in the top corner.',
      caption: ['Late in the night, the stars go out.'],
      next: 'f077'
    },

    f077: {
      scene: S('den', 'inside', { weather: 'storm' },
        [c('player', 'flat', 'scared', 'nest', 'right'), c('snorer', 'lie', 'sleepy', 'sleeper-1', 'right'),
         c('mutterer', 'curl', 'sleepy', 'sleeper-2', 'left')], ['night', 'rain', 'lightning']),
      board: 'MEDIUM, INSIDE THE DEN. Lightning flashes white-blue through the rose stems, rain streams off the leaves, and our cat is pressed flat in the moss nest, ears back, eyes huge. The two other apprentices sleep straight through it, one still snoring. A giant “BOOM!” shakes across the top of the panel.',
      caption: [
        'Wind shakes the rosebush. Rain drums on the leaves.',
        'Thunder booms so loud the ground shivers, and you press yourself flat in your nest.'
      ],
      sfx: 'BOOM!',
      next: 'f078'
    },

    f078: {
      scene: S('den', 'nest', { weather: 'storm' },
        [c('player', 'flat', 'worried', 'nest', 'right')], ['night', 'rain']),
      board: 'CLOSE-UP. Our cat’s face in the nest, eyes wide, raindrops dripping off one rose leaf above. A ghostly outline of the old glass door hangs faintly behind, like a window that isn’t there anymore. One caption box at the top.',
      caption: ['You have never heard a storm without glass between you and it.'],
      next: 'f079'
    },

    f079: {
      scene: S('den', 'doorway', { weather: 'storm' },
        [c('tallyheart', 'lie', 'kind', 'doorway', 'left'), c('player', 'flat', 'worried', 'nest', 'right')], ['night', 'rain']),
      board: 'MEDIUM, FROM INSIDE LOOKING OUT. Through the den’s doorway we see Tallyheart lying right across it in the rain, her broad back to the storm, ginger fur soaked, her calm face turned toward us. Rain sheets down behind her, but the den is dry. Her balloon is warm and solid; captions top left.',
      caption: [
        'Tallyheart’s voice comes from just outside, low and steady.',
        'She’s lying across the doorway in the rain, like a big ginger wall.'
      ],
      say: [{ who: 'tallyheart', text: 'Storms pass. I’m right here.' }],
      next: 'f080'
    },

    f080: {
      scene: S('river', 'crash', { splash: true }, [], ['night', 'rain', 'lightning']),
      board: 'WIDE. From the edge of camp, through the rain, looking out toward the river at night: the long dark shape of the Old Bridge, and beneath it, lit by a fork of lightning, an enormous plume of white water bursting up. Everything else is blue-black and silver rain. A huge jagged “CRASH!” across the sky; captions top and bottom.',
      caption: [
        'Then, far off, toward the river:',
        'Something huge. Something heavy. A splash like a whole tree falling into the water.'
      ],
      sfx: 'CRASH!',
      next: 'f081'
    },

    f081: {
      scene: S('den', 'inside', { weather: 'storm' },
        [c('snorer', 'sit', 'wonder', 'sleeper-1', 'right'), c('mutterer', 'sit', 'wonder', 'sleeper-2', 'right'),
         c('player', 'sit', 'wonder', 'nest', 'right')], ['night', 'rain']),
      board: 'MEDIUM, INSIDE THE DEN. All three apprentices are suddenly sitting bolt upright in their nests with their ears pricked toward the river: the grey tom with one eye open mid-snore, the tortoiseshell with a scrap of moss stuck to her nose, and our cat. Rain patters outside. Caption at the top.',
      caption: ['Every cat in camp lifts their head.'],
      next: 'f082'
    },

    f082: {
      scene: S('den', 'doorway', { weather: 'storm' },
        [c('tallyheart', 'lie', 'sleepy', 'doorway', 'left')], ['night', 'rain']),
      board: 'CLOSE-UP. Tallyheart’s head in the doorway, her torn left ear swiveled toward the river; then she lowers her chin onto her paws with a calm, sleepy look. The rain is softening behind her. Her balloon is gentle and small.',
      caption: ['Tallyheart’s torn ear twitches toward the river. Then she settles down again.'],
      say: [{ who: 'tallyheart', text: 'Whatever that was, it’ll still be there in the morning. Sleep, {name}paw.' }],
      next: 'f083'
    },

    f083: {
      scene: S('den', 'inside', { weather: 'storm' },
        [c('player', 'curl', 'sleepy', 'nest', 'right'), c('snorer', 'curl', 'sleepy', 'sleeper-1', 'right'),
         c('mutterer', 'curl', 'sleepy', 'sleeper-2', 'left'), c('tallyheart', 'lie', 'sleepy', 'doorway', 'left')], ['night', 'rain', 'zzz']),
      board: 'WIDE, FROM ABOVE. The whole den in soft blue shadow: three apprentices curled asleep in their moss nests and Tallyheart a big ginger shape across the doorway, while rain pats gently on the rose leaves. Our cat’s nest is in the middle, small and safe. One caption at the bottom, and a few soft zzz.',
      caption: ['And with the rain on the leaves and Tallyheart at the door, you do.'],
      next: 'f084'
    },

    /* ------------------------------------------------------------------ Chapter end */

    f084: {
      scene: S('den', 'nest', { weather: 'clear' },
        [c('player', 'curl', 'sleepy', 'nest', 'right')], ['night', 'zzz', 'sparkle']),
      board: 'CLOSE-UP. Our cat asleep in the moss nest, paws twitching, and above its head a big empty dream bubble edged with tiny stars like the Sky River, waiting to be filled. Soft silver light. Caption at the top; the dream entry sits below the panel.',
      caption: ['What did {name}paw dream about, on {their} first night in the Clan?'],
      input: { kind: 'dream', next: 'f085' }
    },

    f085: {
      scene: S('den', 'outside', { weather: 'clear' },
        [c('tallyheart', 'lie', 'sleepy', 'doorway', 'left')], ['night', 'stars', 'skyriver', 'zzz']),
      board: 'WIDE CLOSING SHOT. The rosebush den under a clear, rain-washed sky, the Sky River sparkling brighter than ever and every leaf beaded with silver drops. Tallyheart dozes across the doorway, and from inside comes one tiny, contented zzz. Caption at the bottom, with END OF CHAPTER ONE lettered like a title.',
      caption: [
        'The storm rolls away. One by one the stars come back, and the Sky River shines over the rosebush where you are sleeping, warm in your very own nest.',
        'End of Chapter One.'
      ],
      end: true
    }
  };

  PC.story.ch01 = {
    id: 'ch01',
    number: 1,
    title: 'Through the Glass',
    start: 'f001',
    frames: frames,

    counts: {
      'ch01-tails': {
        table: 1, thing: 'tail', things: 'tails', teacher: 'tallyheart',
        facts: [[3, 1], [1, 5], [6, 1], [1, 1], [9, 1], [1, 10], [4, 1], [1, 7], [8, 1]],
        ask: '{a} × {b}',
        praise: [
          'Ha! Easy, yes? Again.',
          'Yes! One tail for every cat.',
          'Right again. Tails never trick a sharp-eyed cat.',
          'Good! You’re counting like a Clan cat already.',
          'That’s it. One cat, one tail. Next!'
        ],
        fast: [
          'You didn’t even have to count that time.'
        ],
        // only after a miss earlier in the same lesson (there was sand to look at)
        fastAfterMiss: [
          'Ha! You didn’t even look at the sand that time.'
        ],
        // asked over the three-cat picture on the lesson's first question (f061 no longer asks it)
        firstPrompt: 'How many tails on those three?',
        // helpIntro when her answer is within 1 of right; helpIntroFar otherwise
        helpIntro: 'Close. Let’s scratch it out together: one line for every tail.',
        helpIntroFar: 'Let’s scratch it out together: one line for every tail.',
        miss: 'There. We’ll come back to that one.',
        // after a miss on a fact that will not come back (it already has, twice)
        missLast: 'There. Now you’ve seen it counted.',
        done: 'Tails are easy. That’s why we start with them. Tomorrow: ears.'
      }
    },

    book: {
      title: '{name}paw’s First Moon',
      chapterTitle: 'Through the Glass',
      // {dream} is what she typed, tidied by the engine (capital letter, full stop) before filling
      dream: '{name}paw’s dream: “{dream}”',
      noDream: 'That night {name}paw slept so soundly that {their} dream stayed a secret, even from {them}.',
      recap: [
        { text: 'For moons, a pillow cat called {petname} watched the wild cats through the glass, while Princess Waffles told the whole story from nineteen floors up.' },

        { when: { specialty: 'noticing' }, text: 'All day long, {petname} had watched the birds through the glass, and nothing ever got past {their} eyes.' },
        { when: { specialty: 'sneaking' }, text: 'All day long, {petname} had ambushed socks from the laundry basket, and no sock in the building was safe.' },
        { when: { specialty: 'climbing' }, text: 'All day long, {petname} had climbed the curtains, and the whole building had heard about it.' },
        { when: { specialty: 'swimming' }, text: '{petname} had been the only cat in the towers who liked water, and had played in the dripping kitchen tap all day long.' },
        { when: { specialty: 'friends' }, text: 'All day long, {petname} had chatted with Princess Waffles, which Waffles said was the best use of anyone’s time.' },

        { when: { stepOut: 'chase' }, text: 'One evening the Tall One opened the door, and {petname} chased a moth straight out onto the grass.' },
        { when: { stepOut: 'slow' }, text: 'One evening the Tall One opened the door, and {petname} stepped out slowly, one paw at a time, onto the grass.' },

        { text: 'The Tall One left the door open a crack, with a dish of water on the warm step.' },

        { when: { spokeUp: true }, text: 'In the garden, {petname} spotted the thirteenth sparrow and said so out loud, and Tallyheart said {they} had sharp eyes.' },
        { when: { spokeUp: false }, text: 'In the garden, {petname} kept quiet about the thirteenth sparrow, but Tallyheart sniffed {them} out anyway and said {they} had sharp eyes.' },

        { when: { joinReason: 'learn' }, text: 'In the hidden camp, {they} told Glintstar, “I want to learn everything.”' },
        { when: { joinReason: 'count' }, text: 'In the hidden camp, {they} told Glintstar, “I can learn to count anything.”' },
        { when: { joinReason: 'brave' }, text: 'In the hidden camp, {they} told Glintstar, “I’m braver than I look.”' },

        { text: 'Glintstar gave {them} one moon to show {they} belonged, and the whole Clan purred {their} new name: {name}paw.' },
        { text: 'Tallyheart taught {them} the very first Count, the tails, and scratched a claw mark into the leaning tree.' },

        { when: { worry: 'small' }, text: 'When {they} worried about being too small, Tallyheart said small cats fit where big cats can’t.' },
        { when: { worry: 'water' }, text: 'When {they} worried about the deep river, Tallyheart promised they would take it one paw at a time.' },
        { when: { worry: 'talk' }, text: 'When {they} worried about talking too much, Tallyheart said a Clan needed a cat who would speak up.' },
        { when: { worry: 'shiny' }, text: 'When {they} worried about shiny things, Tallyheart said {they} would be the first to notice something sparkling that shouldn’t.' },

        { text: 'When a great storm crashed down on the river, Tallyheart lay across the doorway, and {name}paw slept warm in {their} very own nest.' }
      ]
    },

    // the end of her book: "Next" while chapter 2 is built, "Coming soon" (and the hub's button)
    // if it isn't. Nothing about the pile looking smaller: that is what her count is meant to catch.
    teaser: {
      title: 'Chapter 2: After the Storm',
      lines: [
        'Tomorrow, Tallyheart has a new Count for you: **ears**. Somebody should count the prey pile, too.',
        'And what made that enormous splash down by the river?'
      ]
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = PC;
})(typeof globalThis !== 'undefined' ? globalThis : this);
