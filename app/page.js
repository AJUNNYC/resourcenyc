'use client'
import { useState } from 'react'
import {
  Box, Button, Card, CardContent, Chip, Container, CircularProgress,
  TextField, Typography, AppBar, Toolbar, Link, Divider, Select, MenuItem, FormControl
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import SearchIcon from '@mui/icons-material/Search'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import LanguageIcon from '@mui/icons-material/Language'

const LANGUAGES = [
  { code: 'en', label: 'English', ui: {
    title: 'Find what you need',
    subtitle: "Describe your situation — we'll match you to NYC programs that can help.",
    inputLabel: 'Describe your situation',
    placeholder: "e.g. I'm a single mom in the Bronx, I lost my job and need help with food and healthcare for my kids...",
    uploadLabel: 'Upload documents',
    uploadHint: '(optional) — pay stubs, denial letters, leases, images',
    chooseFiles: 'Choose Files',
    findResources: 'Find Resources',
    finding: 'Finding resources...',
    found: 'programs found for you',
    why: 'Why this helps you',
    how: 'How to apply',
    apply: 'Apply here →',
    footer: 'ResourceNYC · Built for HunterHacks 2026 · Data from NYC Open Data'
  }},
  { code: 'es', label: 'Español', ui: {
    title: 'Encuentre lo que necesita',
    subtitle: 'Describa su situación — lo conectaremos con programas de NYC que pueden ayudarle.',
    inputLabel: 'Describa su situación',
    placeholder: 'ej. Soy madre soltera en el Bronx, perdí mi trabajo y necesito ayuda con alimentos y atención médica para mis hijos...',
    uploadLabel: 'Subir documentos',
    uploadHint: '(opcional) — recibos de pago, cartas de denegación, contratos de alquiler, imágenes',
    chooseFiles: 'Seleccionar archivos',
    findResources: 'Buscar recursos',
    finding: 'Buscando recursos...',
    found: 'programas encontrados para usted',
    why: 'Por qué esto le ayuda',
    how: 'Cómo solicitarlo',
    apply: 'Solicitar aquí →',
    footer: 'ResourceNYC · Creado para HunterHacks 2026 · Datos de NYC Open Data'
  }},
  { code: 'zh', label: '中文', ui: {
    title: '找到您需要的帮助',
    subtitle: '描述您的情况——我们将为您匹配纽约市可以提供帮助的项目。',
    inputLabel: '描述您的情况',
    placeholder: '例如：我是住在布朗克斯的单亲妈妈，最近失业了，需要食物和医疗方面的帮助...',
    uploadLabel: '上传文件',
    uploadHint: '（可选）——工资单、拒绝信、租约、图片',
    chooseFiles: '选择文件',
    findResources: '查找资源',
    finding: '正在查找资源...',
    found: '个项目为您匹配成功',
    why: '为什么这对您有帮助',
    how: '如何申请',
    apply: '点此申请 →',
    footer: 'ResourceNYC · 为 HunterHacks 2026 打造 · 数据来源：NYC Open Data'
  }},
  { code: 'ru', label: 'Русский', ui: {
    title: 'Найдите нужную помощь',
    subtitle: 'Опишите вашу ситуацию — мы подберём подходящие программы помощи в Нью-Йорке.',
    inputLabel: 'Опишите вашу ситуацию',
    placeholder: 'напр. Я мать-одиночка в Бронксе, потеряла работу и нуждаюсь в помощи с продуктами и медицинским обслуживанием...',
    uploadLabel: 'Загрузить документы',
    uploadHint: '(необязательно) — расчётные листки, письма об отказе, договоры аренды, фото',
    chooseFiles: 'Выбрать файлы',
    findResources: 'Найти ресурсы',
    finding: 'Поиск ресурсов...',
    found: 'программ найдено для вас',
    why: 'Почему это вам подходит',
    how: 'Как подать заявку',
    apply: 'Подать заявку →',
    footer: 'ResourceNYC · Создано для HunterHacks 2026 · Данные из NYC Open Data'
  }},
  { code: 'bn', label: 'বাংলা', ui: {
    title: 'আপনার প্রয়োজনীয় সাহায্য খুঁজুন',
    subtitle: 'আপনার পরিস্থিতি বর্ণনা করুন — আমরা নিউ ইয়র্ক সিটির উপযুক্ত কার্যক্রম খুঁজে দেব।',
    inputLabel: 'আপনার পরিস্থিতি বর্ণনা করুন',
    placeholder: 'যেমন: আমি ব্রংক্সে একজন একা মা, আমার চাকরি চলে গেছে, খাবার ও স্বাস্থ্যসেবার সাহায্য দরকার...',
    uploadLabel: 'কাগজপত্র আপলোড করুন',
    uploadHint: '(ঐচ্ছিক) — বেতনের রসিদ, প্রত্যাখ্যান পত্র, ভাড়ার চুক্তি, ছবি',
    chooseFiles: 'ফাইল নির্বাচন করুন',
    findResources: 'সাহায্য খুঁজুন',
    finding: 'সাহায্য খোঁজা হচ্ছে...',
    found: 'টি কার্যক্রম আপনার জন্য পাওয়া গেছে',
    why: 'কেন এটি আপনার কাজে আসবে',
    how: 'কীভাবে আবেদন করবেন',
    apply: 'এখানে আবেদন করুন →',
    footer: 'ResourceNYC · HunterHacks 2026-এর জন্য তৈরি · NYC Open Data থেকে তথ্য সংগৃহীত'
  }},
  { code: 'ht', label: 'Kreyòl Ayisyen', ui: {
    title: 'Jwenn sa ou bezwen',
    subtitle: 'Dekri sitiyasyon ou — n ap jwenn pwogram nan vil New York ki ka ede ou.',
    inputLabel: 'Dekri sitiyasyon ou',
    placeholder: 'egz. Mwen se yon manman selibatè nan Bronx, mwen pèdi travay mwen epi mwen bezwen èd ak manje ak swen sante...',
    uploadLabel: 'Voye dokiman',
    uploadHint: '(opsyonèl) — souch pèman, lèt refi, kontra lwaye, foto',
    chooseFiles: 'Chwazi fichye',
    findResources: 'Jwenn resous',
    finding: 'Ap chèche resous...',
    found: 'pwogram jwenn pou ou',
    why: 'Poukisa sa ka ede ou',
    how: 'Kijan pou aplike',
    apply: 'Aplike isit la →',
    footer: 'ResourceNYC · Konstwi pou HunterHacks 2026 · Done soti nan NYC Open Data'
  }},
  { code: 'ko', label: '한국어', ui: {
    title: '필요한 도움을 찾아보세요',
    subtitle: '상황을 설명해 주시면 도움이 될 수 있는 뉴욕시 프로그램을 찾아드립니다.',
    inputLabel: '상황을 설명해 주세요',
    placeholder: '예: 저는 브롱크스에 사는 싱글맘입니다. 실직하여 식료품과 의료 지원이 필요합니다...',
    uploadLabel: '서류 업로드',
    uploadHint: '(선택 사항) — 급여명세서, 거절 통지서, 임대 계약서, 사진',
    chooseFiles: '파일 선택',
    findResources: '지원 프로그램 찾기',
    finding: '프로그램을 찾고 있습니다...',
    found: '개의 프로그램을 찾았습니다',
    why: '이 프로그램이 도움이 되는 이유',
    how: '신청 방법',
    apply: '여기에서 신청하기 →',
    footer: 'ResourceNYC · HunterHacks 2026을 위해 제작 · NYC Open Data 데이터 활용'
  }},
  { code: 'ar', label: 'العربية', ui: {
    title: 'اعثر على المساعدة التي تحتاجها',
    subtitle: 'صِف وضعك — وسنجد لك البرامج المناسبة في مدينة نيويورك.',
    inputLabel: 'صِف وضعك',
    placeholder: 'مثال: أنا أم عزباء في برونكس، فقدت وظيفتي وأحتاج مساعدة في الغذاء والرعاية الصحية لأطفالي...',
    uploadLabel: 'رفع المستندات',
    uploadHint: '(اختياري) — إيصالات الراتب، خطابات الرفض، عقود الإيجار، صور',
    chooseFiles: 'اختيار الملفات',
    findResources: 'البحث عن الموارد',
    finding: 'جارٍ البحث عن الموارد...',
    found: 'برامج تم العثور عليها لك',
    why: 'لماذا هذا البرنامج مناسب لك',
    how: 'كيفية التقديم',
    apply: 'تقديم الطلب من هنا ←',
    footer: 'ResourceNYC · صُمّم لـ HunterHacks 2026 · البيانات من NYC Open Data'
  }},
  { code: 'fr', label: 'Français', ui: {
    title: "Trouvez l'aide dont vous avez besoin",
    subtitle: 'Décrivez votre situation — nous vous orienterons vers les programmes de la ville de New York qui peuvent vous aider.',
    inputLabel: 'Décrivez votre situation',
    placeholder: "ex. Je suis mère célibataire dans le Bronx, j'ai perdu mon emploi et j'ai besoin d'aide pour la nourriture et les soins de santé pour mes enfants...",
    uploadLabel: 'Téléverser des documents',
    uploadHint: '(facultatif) — bulletins de paie, lettres de refus, baux, photos',
    chooseFiles: 'Choisir des fichiers',
    findResources: 'Rechercher des ressources',
    finding: 'Recherche en cours...',
    found: 'programmes trouvés pour vous',
    why: 'En quoi cela peut vous aider',
    how: 'Comment faire une demande',
    apply: 'Faire une demande ici →',
    footer: 'ResourceNYC · Conçu pour HunterHacks 2026 · Données issues de NYC Open Data'
  }},
  { code: 'pl', label: 'Polski', ui: {
    title: 'Znajdź potrzebną pomoc',
    subtitle: 'Opisz swoją sytuację — znajdziemy odpowiednie programy pomocy w Nowym Jorku.',
    inputLabel: 'Opisz swoją sytuację',
    placeholder: 'np. Jestem samotną matką w Bronksie, straciłam pracę i potrzebuję pomocy z żywnością i opieką zdrowotną dla moich dzieci...',
    uploadLabel: 'Prześlij dokumenty',
    uploadHint: '(opcjonalnie) — odcinki wypłat, pisma odmowne, umowy najmu, zdjęcia',
    chooseFiles: 'Wybierz pliki',
    findResources: 'Szukaj programów',
    finding: 'Szukanie programów...',
    found: 'programów znalezionych dla Ciebie',
    why: 'Dlaczego ten program może Ci pomóc',
    how: 'Jak złożyć wniosek',
    apply: 'Złóż wniosek tutaj →',
    footer: 'ResourceNYC · Stworzone na HunterHacks 2026 · Dane z NYC Open Data'
  }},
]

export default function Home() {
  const [input, setInput] = useState('')
  const [files, setFiles] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState('en')

  const t = LANGUAGES.find(l => l.code === lang).ui

  async function handleSubmit() {
    if (!input.trim() && files.length === 0) return
    setLoading(true)
    setResults([])

    const formData = new FormData()
    formData.append('userInput', input)
    formData.append('language', lang)
    for (const file of files) {
      formData.append('files', file)
    }

    const res = await fetch('/api/match', { method: 'POST', body: formData })
    const data = await res.json()
    setResults(data.matches)
    setLoading(false)
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>

      <Box sx={{ backgroundColor: '#000000', py: 0.5, px: 3 }}>
        <Typography variant="caption" sx={{ color: '#ffffff', fontSize: 11 }}>
          An unofficial NYC resource finder powered by AI
        </Typography>
      </Box>

      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#ffffff', borderBottom: '3px solid #003087' }}>
        <Toolbar sx={{ gap: 1, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationCityIcon sx={{ color: '#003087', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ color: '#003087', fontWeight: 900, lineHeight: 1.1, fontSize: 20 }}>
                ResourceNYC
              </Typography>
              <Typography variant="caption" sx={{ color: '#555', fontSize: 11 }}>
                Find benefits & programs for New Yorkers
              </Typography>
            </Box>
          </Box>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={lang}
              onChange={e => setLang(e.target.value)}
              startAdornment={<LanguageIcon sx={{ mr: 1, color: '#003087', fontSize: 18 }} />}
              sx={{ borderRadius: 8, color: '#003087', fontWeight: 'bold', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#003087' } }}
            >
              {LANGUAGES.map(l => (
                <MenuItem key={l.code} value={l.code}>{l.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>

      <Box sx={{ backgroundColor: '#003087', py: 5, px: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 900, mb: 1 }}>
            {t.title}
          </Typography>
          <Typography variant="h6" sx={{ color: '#ccd9f0', fontWeight: 400 }}>
            {t.subtitle}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 5 }}>
        <Card elevation={0} sx={{ border: '1px solid #ddd', borderRadius: 5, mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1.5, color: '#003087' }}>
              {t.inputLabel}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={5}
              placeholder={t.placeholder}
              value={input}
              onChange={e => setInput(e.target.value)}
              variant="outlined"
              sx={{ mb: 3, backgroundColor: '#fafafa', '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
            />

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle2" sx={{ mb: 1, color: '#333' }}>
              {t.uploadLabel} <Typography component="span" variant="caption" color="text.secondary">{t.uploadHint}</Typography>
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{ borderRadius: 8, borderColor: '#003087', color: '#003087', mb: 2 }}
            >
              {t.chooseFiles}
              <input type="file" multiple accept=".pdf,image/*" hidden onChange={e => setFiles(Array.from(e.target.files))} />
            </Button>
            {files.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {files.map((f, i) => (
                  <Chip key={i} label={f.name} size="small" icon={<UploadFileIcon />} sx={{ backgroundColor: '#e8eef7', borderRadius: 8 }} />
                ))}
              </Box>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              sx={{ borderRadius: 8, py: 1.5, backgroundColor: '#003087', fontSize: 16, fontWeight: 'bold', mt: 1 }}
            >
              {loading ? t.finding : t.findResources}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="#003087">
                {results.length} {t.found}
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>
            {results.map((r, i) => (
              <Card key={i} elevation={0} sx={{ border: '1px solid #ddd', borderLeft: '4px solid #003087', borderRadius: 5, mb: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold" color="#003087">{r.name}</Typography>
                    <Chip label={r.category} size="small" sx={{ backgroundColor: '#e8eef7', color: '#003087', fontWeight: 'bold', borderRadius: 8 }} />
                  </Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#333' }}>
                    <strong>{t.why}:</strong> {r.why_it_matches}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: '#333' }}>
                    <strong>{t.how}:</strong> {r.how_to_apply}
                  </Typography>
                  {r.url && (
                    <Link href={r.url} target="_blank" underline="hover" sx={{ color: '#003087', fontWeight: 'bold', fontSize: 14 }}>
                      {t.apply}
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      <Box sx={{ backgroundColor: '#003087', py: 3, mt: 6 }}>
        <Container maxWidth="md">
          <Typography variant="body2" sx={{ color: '#ccd9f0', textAlign: 'center' }}>
            {t.footer}
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}