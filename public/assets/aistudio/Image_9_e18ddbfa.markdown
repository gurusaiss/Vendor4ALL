---
name: Kisaan Modern Tactile
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3f493f'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6f7a6e'
  outline-variant: '#becabc'
  surface-tint: '#006d30'
  primary: '#00652c'
  on-primary: '#ffffff'
  primary-container: '#15803d'
  on-primary-container: '#d3ffd5'
  inverse-primary: '#79db8d'
  secondary: '#006e2f'
  on-secondary: '#ffffff'
  secondary-container: '#6bff8f'
  on-secondary-container: '#007432'
  tertiary: '#005b8c'
  on-tertiary: '#ffffff'
  tertiary-container: '#0075b1'
  on-tertiary-container: '#ecf4ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#95f8a7'
  primary-fixed-dim: '#79db8d'
  on-primary-fixed: '#00210a'
  on-primary-fixed-variant: '#005323'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  telugu-headline:
    fontFamily: Noto Sans Telugu
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  telugu-body:
    fontFamily: Noto Sans Telugu
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 24px
  telugu-caption:
    fontFamily: Noto Sans Telugu
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The brand empowers informal micro-entrepreneurs—local vegetable and fruit pushcart vendors, mandi traders, and rythu bazaar retailers across Visakhapatnam—with dignity, speed, and digital agency. The visual language blends utility with agricultural warmth, steering clear of overly technical Silicon Valley aesthetics in favor of a clean, hyper-legible, civic-grade interface.

Key Brand Pillars:
- **Direct & Uncluttered:** Immediate visual feedback with zero conceptual bloat. Information density is kept low to prevent cognitive overload.
- **Auditory & Visual Dualism:** Voice-first interactions (specifically conversational Telugu AI input) are visually elevated through distinct oceanic sky tones, bridging the gap for low-literacy users.
- **Organic Reliability:** Grounded rich greens paired with crisp, sunlit whites evoke fresh market produce, trust, and fiscal growth.

Design Style:
The system employs a **Tactile High-Clarity** approach: large touch affordances (minimum 48px to 56px hits), subtle grounding card borders, soft diffuse elevations that make interactive surfaces feel physically pressable under outdoor sunlight, and deliberate bilingual structural hierarchies.

## Colors

The palette is tuned specifically for outdoor visibility under high-glare conditions in coastal Andhra Pradesh, utilizing deep contrast ratios exceeding WCAG AAA for core typography and actionable surfaces.

- **Primary (`#15803D` - Deep Emerald Green):** The foundational anchor. Used for primary CTA buttons, active state indicators, primary headers, and trust badges.
- **Secondary / Accent (`#22C55E` - Vibrant Fresh Green):** Denotes vitality, completed transactions, fresh stock, and progress meters.
- **Tertiary / Voice Assistant (`#0284C7` - Oceanic Sky Blue):** Reserved exclusively for Telugu AI voice input actions, listening state pulses, microphone surfaces, and dynamic audio feedback chips (`#E0F2FE` soft background).
- **Surface & Canvas:**
  - Base Canvas: `#F8FAFC` (Soft Slate White) prevents chromatic eye fatigue in midday sun.
  - Cards & Floating Panels: `#FFFFFF` (Pure White).
  - Outlines & Separators: `#E2E8F0` provides gentle containment.
- **Semantic Feedback:**
  - In Stock / Success: Foreground `#16A34A`, Background `#DCFCE7`.
  - Low Stock / Attention: Foreground `#EA580C`, Background `#FFEDD5`.
  - Out of Stock / Alert: Foreground `#DC2626`, Background `#FEE2E2`.
- **Text & Hierarchy:**
  - Primary Slate: `#0F172A` ensures sharp contrast on white and tinted backgrounds.
  - Secondary Slate: `#64748B` for secondary specs, unit weights, and Telugu transcript subtitles.

## Typography

The type system prioritizes bilingual legibility. The primary Latin alphabet uses **Inter**, while Indian regional scripts default to **Noto Sans Telugu** (fallback: Gautami, sans-serif).

Bilingual Stacking Rules:
- Primary titles display English at weight 600/700, immediately tethered to Telugu translations or transcriptions underneath in weight 400/500.
- Telugu glyphs require taller line-height allowances (minimum 1.5x) to accommodate complex vertical vowel signs (maatras) and conjunct consonants without vertical clipping.
- Numbers (prices, weights in kg, counts) are strictly rendered in bold Latin numerals with clear currency symbols (`₹`) for frictionless vendor calculation.
- Avoid all ultra-thin (`font-weight < 400`) variants across both typefaces.

## Layout & Spacing

A mobile-first fluid layout built to withstand physical, one-handed operation on budget Android smartphones in chaotic outdoor environments.

- **Grid Structure:** 
  - Mobile (viewport `< 768px`): 4-column fluid grid, 16px margins, 12px gutters. Catalog feeds default to 2-column equal-width cards or 1-column detail strips.
  - Tablet/Desktop POS (`H͎
N�L�X��[[�ܚY̜X\��[��M��]\��X^^[�]�۝Z[�Y[�]L���H
���]H	��X��[�\�Ί���H�[�\��X�[���\�]\�ۈH��Y�[�ܙ[Y[�[ܚY��HZ[�[][H\X�H]\��]Έ
��
���܈\������\X�X�[ۜ��
��M�Z[�[][HZY�
���܈ܚ]X�[�Y[]�ܚ�\�X�[ۜ�Z�H��X�H�Y��\��]X[�]H�\\��[��]�K؜��Y�\��]ۜ˂�H[X�V�ۙH\��]X�\�N�[XZ�܈[�]�[�H��X�H\��\�[��Y��\��]\�X[�[�H�][�H��\�	HوH�ܙY[������[]�][ۈ	�\���\�X[Y\�\��H]�\�Y�\�X[X�[H\�ܚ\�\�ܙ\��
�L�N�
H��X�[�Y�]�\�K[X�Y[��\�X�[ٙ��]ˈ\��X\�[�Y\�]RH��[�\�Y\��[XZ[�\�[��]�[�Y��ܙY[���Y��\�������]�H�]\�HY�K���H
���]��[��\�
[]�][ۈ
N���\�Y�܈�\�HY�H�[��\�
ю�Q��
K��H
���\�[���\�
[]�][ۈJN�����Yё������[�]�ܙ\��\��Y�L�N�[���\�Y�Έ\��ؘJMK����JK\�L\�ؘJMK����JX�\�Y�܈��X�H\�[��������[[X\�H[\�[�Z[H�X�H��\�˂�H
��X�]�H��Y���ݙ\�
[]�][ۈ�N�����\�Y�Έ�L\�ؘJMK����
K�L��ؘJMK����
X�\YY�X�]�H]X[�]HX��\���]Y�ܞH�[\��[����HX�[ۈ�Y]˂�H
����][����X�H�۝��\�
[]�][ۈ�N�����\�Y�ΈLM\L��ؘJ�L̋NNK��K�M�ؘJ�L̋NNK�JX��]�\�HRHZXܛ�ۙH�]ۈ\�[���\�X[ݙ\��[ܚ]HX�ݙH[�۝[��Y]˂�����\\�H\�Yۈ�\�[H\�\�[X�\�]K��Y[�H�ܛ�\��YZH
��[�Y�\�Έ��\�H�\�H�Y]\�\��\��\�HM�[�[�\�H�[H��[�
N��H
���\�H�\��	�[�[Ί����[�Y[�
M��\�[JH��X�\�H�[�K�ۋXY�ܙ\��]�H�۝Z[�\�]X]�\�\�X�[[�[��[\˂�H
��[�]�	��[�\��]ۜΊ����[�Y[Y
�L
H�[[��\��X[���X�\�H�]ܙ�[�X��ٝ�\�˂�H
���]\�Y�������Y�\�	���X�HZXܛ�ۙH�]ۜΊ���[[�[�Y]�H
��[�YY�[�NNN\
H�Yۘ[��\Y\XX�[]H[�[�[ZX��]H�[��\˂������\ۙ[������]ۜH
���[X\�HX�[ۈ
�ۙ�\�KY][K�[
N�����Y�MN��]HX�[M�ZY�ۈ[ؚ[K�Z[�[][H�۝�^�HM����][Y�H�X�[X�[�X�]�H�]H�Y����M��L���H
���X�ۙ\�HX�[ۈ
Y]�Y]�N���ё������X��ܛ�[��]K�\�L�N��ܙ\�[���M̐X^��H
����X�H�Y��\��]ۈ
RH��X�H[�]
N�����][��܈�X��HX�[ۈ�\�[[Y[���\��[\�
��
H܈�[]�Y�\�[������]�]HZXܛ�ۙHX�ۋX���\[�YY�H�[[��X[^
�\��XZ��8,+�,/�,'�,cx,,�,/�,(x,'�,/�,*8,/�,%x,/�8,*8,b�,%x,cx,%x, �,(x,/ȊK�[Z]�[�[�[X]Y�]�H�[��[��L���X�[�X�]�[H\�[�[�˂������\��
��X�	�[��[�ܞJB�H�ۜ��X�Y�]ё������X��ܛ�[�M��Y]\�[�\�ܙ\�
�L�N�
K��H�X]\�\�H�]X\�H[XY�H[X��Z[
Z[�
HۈHY��X\�][H�[YH[�[��\�
�X]�\�
K[[YYX]H[Y�H�X�]H
8,'�,+�,/�,'�,/�,,�,`X
K�X�H\�[�]
8��M���
K[�H��Z[�[�����[�X�]܈�Y�K��H[��Y\�]ZX���\\��۝���
X�
�
H�]\�ۙ\����X[\�[���]�[�X��Y[�[\˂����������]\��\H[\�\Y
��[�YY�[
KYYL���H
��[�����
8,!x, �,)�,`x,+8,/�,'�,`x,,�,b�8,"x, �,)�,/�N����ѐ�M��X��ܛ�[��M�L�X^��ZY���H
��������
8,)8,%x,cx,%x,`x,-H8,.8,cx,'�,/�,%x,cJN���ё�QX�X��ܛ�[��PMN�^��ZY���H
���]و����
8,!x,+�,/�,*�,b�,+�,/�, �,)�,/�N���ёQL�L��X��ܛ�[��̍���^��ZY�������[�]�Y[HZ[�[][HZY�وL���H[�X�]�H�]N�ё������[K�\�БQLX�ܙ\���HX�]�H���\��]N���MN��ܙ\��]�X�H�ѐ�M���˂�H[�^\�X���\[�YY�H�X\�X�ۜ�[�[�[�H[Y�H]Y[��ZY[��H�]ۜ�
�XZ�\�X�ۊH��XY[�]�Y[[���X�[ۜ�[�Y�������X�؛�\�	��Y[��۝��HZ[�[][H��[�[�������][�H]\�XK��H�X��Y�]N��[Y�MN��]���]H�X��X\�ˈY��\�X[�۝�\��܈]ZX���[X�[ۈو][K[ܙ\��X���]�