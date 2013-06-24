﻿using BundleTransformer.Core.Assets;
using BundleTransformer.Core.Translators;
using BundleTransformer.Less.Translators;
using BundlingAndMinificationForTheMasses.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace BundlingAndMinificationForTheMasses.Providers.Less
{
    public class Translator: IFileTranslator
    {
        public string Name
        {
            get { return "Less Dynamic Stylesheet"; }
        }

        public string FileExtension
        {
            get { return "less"; }
        }

        public string FileMimeType
        {
            get { return "text/x-less"; }
        }

        public Enums.TranslatorType TranslatorType
        {
            get { return Enums.TranslatorType.StyleSheet; }
        }

        public IEnumerable<string> EditorClientDependencies
        {
            get 
            { 
                var scripts = new List<string>();
                scripts.Add("CodeMirror/js/mode/less/less.js");
                return scripts;
            }
        }

        public IEnumerable<Exception> ValidateTranslation(string path)
        {
            var retVal = new List<Exception>();
            try
            {
                IAsset file = new Asset(path);
                LessTranslator lessTranslator = new LessTranslator();
                lessTranslator.Translate(file);
            }
            catch (AssetTranslationException ex)
            {
                retVal.Add(ex);
            }

            return retVal;
            
        }

        public void SaveTranslation(string path)
        {
            IAsset file = new Asset(path);
            LessTranslator lessTranslator = new LessTranslator();
            var compiled = lessTranslator.Translate(file);

            var normalCSS = path.Replace("." + FileExtension, ".css");

            using (var compiledCSS = File.CreateText(normalCSS))
            {
                compiledCSS.Write(compiled.Content);
                compiledCSS.Close();
            }
        }
    }
}